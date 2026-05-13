import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const AssignmentDetails = () => {
  const { id, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, showConfirm } = useNotification();
  
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
    if (!submissionFile) return showToast("Please select a file to submit.", "error");
    
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('assignment_id', assignmentId);
      data.append('file', submissionFile);
      if (submissionNote) data.append('note', submissionNote);

      await api.post('/submissions', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await fetchData();
    } catch (err) {
      showToast("Failed to submit work.", "error");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssignment = () => {
    showConfirm(
      "Delete Assignment",
      "Are you sure you want to delete this assignment? All submissions will also be deleted.",
      async () => {
        try {
          await api.delete(`/assignments/${assignmentId}`, { data: { user_id: user?.id } });
          showToast("Assignment deleted successfully", "success");
          navigate(`/class/${id}`);
        } catch (err) {
          showToast("Failed to delete assignment.", "error");
        }
      }
    );
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-text-secondary animate-fade-in">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="font-medium tracking-wide">Loading assignment data...</p>
    </div>
  );

  if (!assignment) return (
    <div className="p-20 text-center glass m-10 rounded-3xl max-w-2xl mx-auto shadow-premium animate-fade-in">
      <div className="text-6xl mb-6">📄</div>
      <h2 className="text-3xl font-bold mb-4 text-text-main">Assignment not found</h2>
      <button onClick={() => navigate(`/class/${id}`)} className="btn-primary inline-flex items-center gap-2 mt-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Class
      </button>
    </div>
  );

  const isTeacher = classroom?.teacher_id === user?.id;
  const isExpired = assignment.due_date && new Date() > new Date(assignment.due_date);
  const mySubmission = assignment.submissions?.find(sub => sub.user_id === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-10 glass w-fit pr-6 pl-2 py-2 rounded-full shadow-sm animate-slide-up">
        <button 
          onClick={() => navigate(`/class/${id}`)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-slate-50 text-text-main shadow-sm transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-text-main tracking-tight">{classroom?.name}</h1>
          <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">{classroom?.section}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        {/* Left Column: Details & Instructions */}
        <div className="space-y-6 md:space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="glass p-5 md:p-8 rounded-[2rem]">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 border-b border-slate-200 pb-6 md:pb-8">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 shadow-lg shadow-primary/30">
                📝
              </div>
              <div className="flex-grow w-full">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-text-main tracking-tight leading-tight">{assignment.title}</h1>
                  {isTeacher && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/class/${id}/assignments/${assignmentId}/edit`)}
                        className="p-2 md:p-3 bg-slate-50 border border-slate-200 text-text-secondary hover:text-primary rounded-xl transition-all shadow-sm"
                        title="Edit Assignment"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button 
                        onClick={handleDeleteAssignment}
                        className="p-2 md:p-3 bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Delete Assignment"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-xs md:text-sm text-text-secondary mb-6 font-medium">
                  <span className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">{classroom?.teacher?.name?.[0]}</div> {classroom?.teacher?.name || 'Teacher'}</span>
                  <span className="hidden sm:inline opacity-30">•</span>
                  <span>Posted {new Date(assignment.created_at).toLocaleDateString()}</span>
                  <div className="md:ml-auto w-full md:w-auto">
                    <span className={`inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 ${isExpired ? 'border-red-200 bg-red-50' : ''}`}>
                      <span className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                      <span className={`font-bold tracking-wide ${isExpired ? 'text-red-600' : 'text-text-main'}`}>
                        {assignment.due_date ? `Due ${new Date(assignment.due_date).toLocaleDateString()}` : 'No due date'}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="prose max-w-none text-text-main text-base md:text-[17px] leading-relaxed bg-slate-50/50 p-4 md:p-6 rounded-2xl border border-slate-100">
                  {assignment.description ? (
                    <p className="whitespace-pre-wrap">{assignment.description}</p>
                  ) : (
                    <p className="italic text-text-secondary">No instructions provided.</p>
                  )}
                </div>
              </div>
            </div>

            {assignment.attachments?.length > 0 && (
              <div className="pt-8">
                <h3 className="text-lg font-extrabold text-text-main mb-6 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  Reference Materials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {assignment.attachments.map(file => (
                    <a 
                      key={file.id} 
                      href={`http://127.0.0.1:8080/storage/${file.file_path}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-primary/30 transition-all group"
                    >
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm uppercase group-hover:scale-110 transition-transform">
                        {file.file_path.split('.').pop()}
                      </div>
                      <div className="overflow-hidden flex-grow">
                        <p className="text-[15px] font-bold text-text-main truncate group-hover:text-primary transition-colors">{file.file_path.split('/').pop()}</p>
                        <p className="text-xs text-text-secondary uppercase tracking-wider font-medium mt-0.5">{file.file_path.split('.').pop()} Document</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Your Work or Submissions */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {!isTeacher ? (
            <div className="glass p-8 rounded-[2rem] sticky top-24 border-t-4 border-t-primary">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold text-text-main">Your Work</h3>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${mySubmission ? 'bg-green-100 text-green-700' : isExpired ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>
                  {mySubmission ? 'Turned In' : isExpired ? 'Missing' : 'Assigned'}
                </span>
              </div>

              {mySubmission ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-5 bg-green-50 text-green-700 rounded-2xl border border-green-200 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="font-bold text-lg">Work submitted successfully!</span>
                  </div>
                  {mySubmission.file && (
                    <a 
                      href={`http://127.0.0.1:8080/storage/${mySubmission.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-3 w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-text-main hover:border-primary hover:text-primary hover:shadow-md transition-all group"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      View Submitted File
                    </a>
                  )}
                  <button className="w-full p-4 border-2 border-slate-200 text-text-secondary font-bold rounded-2xl hover:bg-slate-50 hover:text-red-500 hover:border-red-200 transition-all">
                    Unsubmit Work
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitWork} className="space-y-6">
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${submissionFile ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary/50 hover:bg-slate-50'}`}>
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${submissionFile ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                      </div>
                      <span className="font-bold text-[15px] text-text-main mb-1">
                        {submissionFile ? submissionFile.name : 'Click or drag file to upload'}
                      </span>
                      <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">
                        {submissionFile ? (submissionFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'PDF, DOCX, ZIP, IMAGES'}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={submitting || !submissionFile}
                    className="w-full bg-gradient-to-r from-primary to-primary-hover text-white font-bold p-4 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:shadow-none text-lg flex justify-center items-center gap-2"
                  >
                    {submitting ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Turning in...</>
                    ) : 'Turn In Assignment'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="glass p-8 rounded-[2rem] sticky top-24 border-t-4 border-t-secondary">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-extrabold text-text-main">Student Work</h3>
                <span className="font-bold text-secondary bg-secondary/10 px-4 py-1.5 rounded-full text-sm">{assignment.submissions?.length || 0} Turned in</span>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {assignment.submissions?.length > 0 ? (
                  assignment.submissions.map(sub => (
                    <div key={sub.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-secondary/30 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center font-bold text-slate-700 shadow-sm text-sm">
                          {sub.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[15px] text-text-main group-hover:text-secondary transition-colors">{sub.user?.name}</p>
                          <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">{new Date(sub.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {sub.file && (
                        <a 
                          href={`http://127.0.0.1:8080/storage/${sub.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-sm"
                          title="View Submission"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="text-4xl mb-3 opacity-50">📥</div>
                    <p className="font-bold text-text-main">No submissions yet.</p>
                    <p className="text-sm text-text-secondary mt-1">Students' work will appear here.</p>
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
