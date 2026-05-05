import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AssignmentDetails = () => {
  const { id, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assignment, setAssignment] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');

  useEffect(() => {
    fetchData();
  }, [id, assignmentId]);

  const fetchData = async () => {
    try {
      // Assuming you have an API route to fetch a single assignment
      const resClassroom = await api.get(`/classrooms/${id}`);
      setClassroom(resClassroom.data);
      
      const resAssignment = await api.get(`/assignments/${assignmentId}`);
      setAssignment(resAssignment.data);
    } catch (err) {
      console.error("Error fetching assignment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSubmissionFile(e.target.files[0]);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!submissionFile) return alert("Please select a file to submit.");
    
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('assignment_id', assignmentId);
      data.append('file', submissionFile);
      if (submissionNote) data.append('note', submissionNote);

      await api.post('/submissions', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Refresh to show the submission
      await fetchData();
    } catch (err) {
      alert("Failed to submit work.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-5 text-text-secondary">
      <div className="w-12 h-12 bg-primary rounded-full animate-ping opacity-75"></div>
      <p>Loading assignment...</p>
    </div>
  );

  if (!assignment) return (
    <div className="p-20 text-center bg-white m-10 rounded-2xl border border-border">
      <h2 className="text-2xl font-bold mb-4">Assignment not found</h2>
      <button onClick={() => navigate(`/class/${id}`)} className="btn-primary">Back to Class</button>
    </div>
  );

  const isTeacher = classroom?.teacher_id === user?.id;
  const isExpired = assignment.due_date && new Date() > new Date(assignment.due_date);
  const mySubmission = assignment.submissions?.find(sub => sub.user_id === user?.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(`/class/${id}`)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-text-secondary transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-main">{classroom?.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Left Column: Details & Instructions */}
        <div className="space-y-6">
          <div className="flex items-start gap-4 border-b border-border pb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl flex-shrink-0 mt-1">
              📝
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-text-main mb-2">{assignment.title}</h1>
                {isTeacher && (
                  <button 
                    onClick={() => navigate(`/class/${id}/assignments/${assignmentId}/edit`)}
                    className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title="Edit Assignment"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                <span>{classroom?.teacher?.name || 'Teacher'} • {new Date(assignment.created_at).toLocaleDateString()}</span>
                <span className={`font-medium ${isExpired ? 'text-red-500' : 'text-text-main'}`}>
                  {assignment.due_date ? `Due ${new Date(assignment.due_date).toLocaleDateString()}` : 'No due date'}
                </span>
              </div>
              <div className="prose max-w-none text-text-main">
                {assignment.description ? (
                  <p className="whitespace-pre-wrap">{assignment.description}</p>
                ) : (
                  <p className="italic text-text-secondary">No instructions provided.</p>
                )}
              </div>
            </div>
          </div>

          {assignment.attachments?.length > 0 && (
            <div>
              <h3 className="font-bold text-text-main mb-4">Attachments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assignment.attachments.map(file => (
                  <a 
                    key={file.id} 
                    href={`http://127.0.0.1:8080/storage/${file.file_path}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:shadow-md transition-shadow group"
                  >
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-xs uppercase group-hover:scale-110 transition-transform">
                      {file.file_path.split('.').pop()}
                    </div>
                    <div className="overflow-hidden flex-grow">
                      <p className="text-sm font-bold text-text-main truncate">{file.file_path.split('/').pop()}</p>
                      <p className="text-xs text-text-secondary uppercase">{file.file_path.split('.').pop()}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Your Work or Submissions */}
        <div className="space-y-6">
          {!isTeacher ? (
            <div className="card-premium p-6 shadow-xl border border-border/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-text-main">Your work</h3>
                <span className={`text-sm font-bold ${mySubmission ? 'text-green-500' : isExpired ? 'text-red-500' : 'text-primary'}`}>
                  {mySubmission ? 'Turned in' : isExpired ? 'Missing' : 'Assigned'}
                </span>
              </div>

              {mySubmission ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 text-center font-medium">
                    Successfully turned in!
                  </div>
                  {mySubmission.file && (
                    <a 
                      href={`http://127.0.0.1:8080/storage/${mySubmission.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full p-3 border border-border rounded-xl font-bold text-text-main hover:bg-bg transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      View Submitted File
                    </a>
                  )}
                  <button className="w-full p-3 border border-border text-text-secondary font-bold rounded-xl mt-2 hover:bg-black/5 transition-colors">
                    Unsubmit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitWork} className="space-y-4">
                  <div className="relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-black/5 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center">
                      <svg className="w-8 h-8 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                      <span className="font-bold text-sm text-text-main">
                        {submissionFile ? submissionFile.name : 'Add or create'}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={submitting || !submissionFile}
                    className="w-full bg-primary text-white font-bold p-3 rounded-xl shadow-md hover:bg-primary-hover transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Turning in...' : 'Turn in'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="card-premium p-6 shadow-xl border border-border/50">
              <h3 className="text-xl font-bold text-text-main mb-6">Student Submissions</h3>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {assignment.submissions?.length > 0 ? (
                  assignment.submissions.map(sub => (
                    <div key={sub.id} className="p-4 bg-bg rounded-xl border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-primary shadow-sm text-xs">
                          {sub.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-text-main">{sub.user?.name}</p>
                          <p className="text-[10px] text-text-secondary">{new Date(sub.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {sub.file && (
                        <a 
                          href={`http://127.0.0.1:8080/storage/${sub.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors"
                        >
                          View
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    <p>No submissions yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
