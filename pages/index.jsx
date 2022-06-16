import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useAppContext } from "../context/state";
import { supabase } from "../components/services/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [passwordError, setPasswordError] = useState(false);
  // form validation rules 
  const validationSchema = Yup.object().shape({
      password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required')
          .test({
            name: "validate-event-passcode",
            params: 'value',
            message: "Password not found. Please try again.",
            test: async (value) => {
              const { data: eventPasscodeList } = await supabase
                .from('event_management')
                .select("event_date, event_passcode, event_name")
                .eq('event_passcode', value);
              if (eventPasscodeList && eventPasscodeList.length > 0) {
                setPasswordError(false);
                return true;
              }
              setPasswordError(true);
              return false;
            }
          }),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const [session, setSession] = useAppContext().session;

  const onSubmit = async (data) => {
    if (!passwordError) {
      setSession(data.password);
      router.push("/attendance")
    }
  }

  return (
      <div className="card m-3">
          <h5 className="card-header">Creative Team Attendance</h5>
          <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-row">
                      <div className="form-group col-12">
                          <label>Password</label>
                          <input name="password" type="text" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.password?.message}</div>
                      </div>
                  </div>
                  <div className="form-group">
                      <button type="submit" className="btn btn-primary mr-1">Submit</button>
                  </div>
              </form>
          </div>
      </div>
  );
}
