import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from "../components/services/supabaseClient";
import { useAppContext } from "../context/state";
import { useRouter } from 'next/router';

export default function Attendance() {

  const fetchTeams = async () => {
    const { data: creativeTeamsList, error } = await supabase
      .from('creative_teams')
      .select("team");
    const creativeTeams = creativeTeamsList
      .map((obj) => obj.team)
      .filter((elem, index, list) => list.indexOf(elem) === index);
    setTeams(creativeTeams);
  };

  const fetchTeamMembers = async (team) => {
    const { data: creativeTeamMembersList, error } = await supabase
      .from('creative_teams')
      .select("name")
      .eq('team', team);
    const creativeTeamMembers = creativeTeamMembersList
      .map((obj) => obj.name);
    setTeamMembers(creativeTeamMembers);
  };

  const fetchAttendance = async (eventPasscode) => {
    const { data: attendanceList, error } = await supabase
      .from('attendance')
      .select("id, name, is_present")
      .eq("event_passcode", eventPasscode);
    if (attendanceList && attendanceList.length > 0) {
      setSubmittedAttendance(true);
    }
  };

  const router = useRouter();
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const [teams, setTeams] = useState([]);
  const [selectTeam, setSelectTeam] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [session] = useAppContext().session;
  const [submittedAttendance, setSubmittedAttendance] = useState(false);

  useEffect(() => {    
    if (session) {
      fetchAttendance(session);

      fetchTeams();

      if (selectTeam !== "") {
        fetchTeamMembers(selectTeam);
      } else {
        setTeamMembers([])
      }
    } else {
      router.push("/");
    }
  }, [session, selectTeam])

  const onSubmit = async (data) => {
    // display form data on success
    const attendanceObject = Object.keys(data)
      .filter((key) =>  key.includes("member_"))
      .map((key) => ({ name: key.replace("member_", ""), is_present: data[key], event_passcode: session }));
    const { data: insertedData, error } = await supabase
      .from('attendance')
      .insert(attendanceObject);
    console.log(insertedData)
  };

  return (
    <div className="card m-3">
        <h5 className="card-header">Attendance</h5>

        {submittedAttendance ? (
          <div className="card-body">
            <div className="form-row ml-3">
              <div className="form-group col">
                <p>You've already submitted attendance for this event!</p>
                <button onClick={(e) => router.push(`events/attendance/${session}`)} className="btn btn-primary mr-1">View Attendance</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>

              <div className="form-row">
                <div className="form-group col">
                  <label>Team</label>
                  <select name="team" {...register('team')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} onChange={((e) => setSelectTeam(e.target.value))}>
                    <option value=""></option>
                    {teams.map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.team?.message}</div>
                </div>
              </div>

              {(teamMembers.length > 0) && (
                <div className="form-row ml-3">
                  <div className="form-group col">
                    <p className="description">Check the box if the member was present; leave unchecked otherwise</p>
                  </div>
                </div>
              )}

              {teamMembers.map((teamMember) => (
                <div key={teamMember} className="form-row ml-3">
                  <div className="form-group col">
                    <input name={teamMember} type="checkbox" {...register(`member_${teamMember}`)} id={teamMember} className={`form-check-input`} />
                    <label htmlFor={teamMember} className="form-check-label">{teamMember}</label>
                  </div>
                </div>
              ))}
              
              {(teamMembers.length > 0) && (
                <div className="form-group">
                  <button type="submit" className="btn btn-primary mr-1">Submit Attendance</button>
                </div>
              )}
            </form>
          </div>
        )} 
    </div>
  );
}