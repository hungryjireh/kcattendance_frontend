import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from "../../../context/state";

export default function Generate() {
  const router = useRouter();
  const [generatedEventDetails, setGeneratedEventDetails] = useAppContext().generatedEventDetails;

  useEffect(() => {
    if (!generatedEventDetails) {
      router.push("/");
    }
  }, [generatedEventDetails])

  return (
    <div className="card m-3">
      <h5 className="card-header">Generate Event - Success</h5>
        {generatedEventDetails && (
          <div className="card-body">
            <div className="form-row">
              <div className="form-group col-12">
                  <p>Successfully generated event password {generatedEventDetails.event_passcode} for {generatedEventDetails.event_name} on {generatedEventDetails.event_date} to collect attendance for.</p>
              </div>

              <div className="form-group col-12">
                <button onClick={(e) => router.push("/")} className="btn btn-primary mr-1">Back to Home</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}