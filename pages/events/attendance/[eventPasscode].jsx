import { useState, useEffect } from 'react';
import { supabase } from "../../../components/services/supabaseClient";
import { useRouter } from 'next/router';

export default function AttendanceList() {

  const [attendees, setAttendees] = useState([]);
  const [eventDetails, setEventDetails] = useState([]);
  const router = useRouter();
  const { eventPasscode } = router.query;

  const fetchEventDetails = async (eventPasscode) => {
    const { data: eventsList, error } = await supabase
      .from('event_management')
      .select("event_name, event_passcode, event_date")
      .eq("event_passcode", eventPasscode);
    if (eventsList && eventsList.length > 0) {
      setEventDetails(eventsList[0]);
    }
  };

  const fetchAttendance = async (eventPasscode) => {
    const { data: attendanceList, error } = await supabase
      .from('attendance')
      .select("id, name, is_present")
      .eq("event_passcode", eventPasscode);
    if (attendanceList && attendanceList.length > 0) {
      setAttendees(attendanceList);
    }
  };

  useEffect(() => {
    if (eventPasscode) {
      fetchEventDetails(eventPasscode);
      fetchAttendance(eventPasscode);
    }
  }, [eventPasscode])

  

  return (
    <div className="card m-3">
        <h5 className="card-header">Event Details</h5>
        <div className="card-body">

          <div className="form-row ml-3">
            <div className="form-group col">
              <p>Event Name: {eventDetails.event_name}</p>
              <p>Event Date: {eventDetails.event_date}</p>
              <p>Event Passcode: {eventDetails.event_passcode}</p>
            </div>
          </div>

          {attendees.map((attendee) => (
            <div key={attendee.id} className="form-row ml-3">
              <div className="form-group col">
                <input name={attendee.id} type="checkbox" id={attendee.id} className={`form-check-input`} disabled={true} defaultChecked={attendee.is_present}/>
                <label htmlFor={attendee.id} className="form-check-label">{attendee.name}</label>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}