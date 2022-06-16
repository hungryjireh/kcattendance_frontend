import { useState, useEffect } from 'react';
import { supabase } from "../../components/services/supabaseClient";
import { useRouter } from 'next/router';

export default function Events() {

  const fetchEvents = async () => {
    const { data: eventList, error } = await supabase
      .from('event_management')
      .select("event_name, event_passcode, event_date");
    if (eventList && eventList.length > 0) {
      setEvents(eventList);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [])

  const router = useRouter();
  const [events, setEvents] = useState([]);

  return (
    <div className="card m-3">
        <h5 className="card-header">All Events</h5>
        <div className="card-body">
          {events.map((event) => (
            <div key={event.event_passcode} className="card m-3">
              <h6 className="card-header">{event.event_name}</h6>
              <div className="card-body">
                <div className="form-row ml-3">
                  <div className="form-group col">
                    <p>Event Date: {event.event_date}</p>
                    <p>Event Passcode: {event.event_passcode}</p>
                    <button onClick={(e) => router.push(`events/attendance/${event.event_passcode}`)} className="btn btn-primary mr-1">View Attendance</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}