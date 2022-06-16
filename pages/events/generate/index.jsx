import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useAppContext } from "../../../context/state";
import { supabase } from "../../../components/services/supabaseClient";

const generatePassword = (length) => {
  let result           = '';
  const characters       = '0123456789';
  const charactersLength = characters.length;
  for (const i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function Generate() {
  const router = useRouter();
  // form validation rules 
  const validationSchema = Yup.object().shape({
      name: Yup.string()
          .required('Name is required'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const [generatedEventDetails, setGeneratedEventDetails] = useAppContext().generatedEventDetails;

  const onSubmit = async (data) => {
    const generatedEventObject = {
      event_name: data.name,
      event_date: data.eventDate,
      event_passcode: generatePassword(6)
    };
    const { data: generatedEventDatabaseResponseData, error } = await supabase
      .from('event_management')
      .insert([generatedEventObject]);
    if (generatedEventDatabaseResponseData) {
      setGeneratedEventDetails(generatedEventObject);
      router.push("/events/generate/success");
    }
  }

  return (
    <div className="card m-3">
      <h5 className="card-header">Generate Event</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col-12">
                <label>Name</label>
                <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col">
                <label>Date</label>
                <input type="date" {...register('eventDate')} id="eventDate" name="eventDate" className={`form-control ${errors.eventDate ? 'is-invalid' : ''}`}
                  defaultValue={`${new Date().toISOString().split('T')[0]}`}
                  min="2022-01-01"></input>
                <div className="invalid-feedback">{errors.eventDate?.message}</div>
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary mr-1">Generate Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}
