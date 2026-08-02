import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

// --- COMPONENTS ---

function InboxTab() {
  const [selectedId, setSelectedId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  
  useEffect(() => {
    const q = query(collection(db, 'users'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplicants(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    });
    return unsubscribe;
  }, [selectedId]);

  const selectedApp = applicants.find(a => a.id === selectedId);

  const handleApprove = async () => {
    if (!selectedApp) return;
    await updateDoc(doc(db, 'users', selectedApp.id), { status: 'approved' });
    const subject = encodeURIComponent("Welcome to the Community");
    const body = encodeURIComponent(`Hi ${selectedApp.fullName.split(' ')[0]},\n\nWe reviewed your application and would love to welcome you to the community.\n\n[Next steps here]\n\nBest,\nName™ Team`);
    window.location.href = `mailto:${selectedApp.email}?subject=${subject}&body=${body}`;
    setSelectedId(null);
  };

  const handleDecline = async () => {
    if (!selectedApp) return;
    await updateDoc(doc(db, 'users', selectedApp.id), { status: 'declined' });
    const subject = encodeURIComponent("Update on your application");
    const body = encodeURIComponent(`Hi ${selectedApp.fullName.split(' ')[0]},\n\nThank you for applying. At this time, we aren't able to offer you a spot in the community.\n\nBest,\nName™ Team`);
    window.location.href = `mailto:${selectedApp.email}?subject=${subject}&body=${body}`;
    setSelectedId(null);
  };

  const updateNotes = async (e) => {
    if (!selectedApp) return;
    await updateDoc(doc(db, 'users', selectedApp.id), { adminNotes: e.target.value });
  };

  return (
    <>
      <div className={styles.listColumn}>
        <div className={styles.listHeader}>
          <span className={styles.num}>INBOX ({applicants.length})</span>
        </div>
        <div className={styles.list}>
          {applicants.map(app => (
            <div key={app.id} className={`${styles.listItem} ${selectedId === app.id ? styles.selected : ''}`} onClick={() => setSelectedId(app.id)}>
              <div className={styles.listMeta}>
                <span className={styles.listDate}>{app.date}</span>
                <span className={styles.listStatus}>{app.status}</span>
              </div>
              <h3 className={styles.listName}>{app.fullName}</h3>
              <p className={styles.listCat}>{app.buildingCategory}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dossierColumn}>
        {selectedApp ? (
          <div className={styles.dossierInner}>
            <div className={styles.dossierHeader}>
              <div>
                <h2 className={styles.dossierName}>{selectedApp.fullName}</h2>
                <a href={`mailto:${selectedApp.email}`} className={styles.dossierEmail}>{selectedApp.email}</a>
              </div>
              <div className={styles.actions}>
                <button onClick={handleDecline} className={styles.btnDecline}>Decline</button>
                <button onClick={handleApprove} className={styles.btnApprove}>Approve &rarr;</button>
              </div>
            </div>

            <div className={styles.dossierContent}>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>What are you working on right now?</h4>
                <p className={styles.a}>[{selectedApp.buildingCategory}] {selectedApp.currentlyBuilding}</p>
                {selectedApp.freelanceWork && selectedApp.freelanceWork.length > 0 && (
                  <p className={styles.a}>Freelance Work: {selectedApp.freelanceWork.join(', ')}</p>
                )}
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>Show Us What You Do</h4>
                {selectedApp.profileLink && <p className={styles.a}>Where to see work: {selectedApp.profileLink}</p>}
                {selectedApp.previousWorkLink && <p className={styles.a}>Previous Work: {selectedApp.previousWorkLink}</p>}
                {selectedApp.proudWorkStory && <p className={styles.a}>Proud Work Story: {selectedApp.proudWorkStory}</p>}
                {selectedApp.meaningfulWorkStory && <p className={styles.a}>Meaningful Work Story: {selectedApp.meaningfulWorkStory}</p>}
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>What are you working through right now?</h4>
                <p className={styles.a}>{selectedApp.biggestChallenge}</p>
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>What have you explored so far?</h4>
                <p className={styles.a}>{selectedApp.triedSolutions}</p>
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>What remains unresolved?</h4>
                <p className={styles.a}>{selectedApp.whatDidntWork}</p>
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>What have you learned along the way?</h4>
                <p className={styles.a}>{selectedApp.learnedHardWay}</p>
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>What can you genuinely help another member with?</h4>
                <p className={styles.a}>{selectedApp.canHelpWith}</p>
                {selectedApp.helpedSomeoneStory && <p className={styles.a}>Helped someone story: {selectedApp.helpedSomeoneStory}</p>}
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>Who You Want To Meet</h4>
                {selectedApp.wantToMeet && selectedApp.wantToMeet.length > 0 && <p className={styles.a}>Want to meet: {selectedApp.wantToMeet.join(', ')}</p>}
                {selectedApp.wantFromCommunity && <p className={styles.a}>Take away from community: {selectedApp.wantFromCommunity}</p>}
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>If another member came to you for help, what would you offer?</h4>
                <p className={styles.a}>{selectedApp.willingToOffer}</p>
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>Why do you want to be part of this community?</h4>
                <p className={styles.a}>{selectedApp.whyApplying}</p>
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>What do you think a community like this should never become?</h4>
                <p className={styles.a}>{selectedApp.shouldNotBecome}</p>
              </div>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>Commitment</h4>
                <p className={styles.a}>{selectedApp.commitment && Array.isArray(selectedApp.commitment) ? selectedApp.commitment.join(', ') : selectedApp.commitment}</p>
              </div>
              {selectedApp.wishKnown && (
                <div className={styles.qaGroup}>
                  <h4 className={styles.q}>What's something you wish you'd understood earlier?</h4>
                  <p className={styles.a}>{selectedApp.wishKnown}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div className={styles.notesSection}>
                <h4 className={styles.qDark}>Admin Notes (Private)</h4>
                <textarea 
                  className={styles.notesInput} 
                  placeholder="Write something for the future..." 
                  value={selectedApp.adminNotes}
                  onChange={updateNotes}
                />
              </div>

            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>Select an application to review.</div>
        )}
      </div>
    </>
  );
}

function MembersTab() {
  const [selectedId, setSelectedId] = useState(null);
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    const q = query(collection(db, 'users'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    });
    return unsubscribe;
  }, [selectedId]);

  const selectedMember = members.find(m => m.id === selectedId);

  const updateNotes = async (e) => {
    if (!selectedMember) return;
    await updateDoc(doc(db, 'users', selectedMember.id), { adminNotes: e.target.value });
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    if (selectedMember.role === 'founder') {
      alert("Founders cannot be removed.");
      return;
    }
    const pwd = window.prompt("Enter admin password to remove this member:");
    // Password is stored securely in .env
    if (pwd && pwd === import.meta.env.VITE_ADMIN_PASSWORD) {
      await updateDoc(doc(db, 'users', selectedMember.id), { status: 'removed' });
      setSelectedId(null);
    } else if (pwd !== null) {
      alert("Incorrect password.");
    }
  };

  return (
    <>
      <div className={styles.listColumn}>
        <div className={styles.listHeader}>
          <span className={styles.num}>MEMBERS ({members.length})</span>
        </div>
        <div className={styles.list}>
          {members.map(member => (
            <div key={member.id} className={`${styles.listItem} ${selectedId === member.id ? styles.selected : ''} ${member.role === 'founder' ? styles.founderItem : ''}`} onClick={() => setSelectedId(member.id)}>
              <div className={styles.listMeta}>
                <span className={styles.listDate}>Joined {member.date}</span>
              </div>
              <h3 className={styles.listName}>
                {member.fullName}
                {member.role === 'founder' && <span className={styles.founderBadge}>FOUNDER</span>}
              </h3>
              <p className={styles.listCat}>{member.buildingCategory}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dossierColumn}>
        {selectedMember ? (
          <div className={styles.dossierInner}>
            <div className={styles.dossierHeader}>
              <div>
                <h2 className={styles.dossierName}>
                  {selectedMember.fullName}
                  {selectedMember.role === 'founder' && <span className={styles.founderBadge} style={{fontSize: '14px', padding: '4px 10px'}}>FOUNDER</span>}
                </h2>
                <a href={`mailto:${selectedMember.email}`} className={styles.dossierEmail}>{selectedMember.email}</a>
              </div>
              <div className={styles.actions}>
                {selectedMember.role !== 'founder' && (
                  <button className={styles.btnDecline} onClick={handleRemoveMember}>Remove Member</button>
                )}
              </div>
            </div>

            <div className={styles.dossierContent}>
              <div className={styles.qaGroup}>
                <h4 className={styles.q}>Category</h4>
                <p className={styles.a}>{selectedMember.buildingCategory}</p>
              </div>

              {/* Admin Notes */}
              <div className={styles.notesSection}>
                <h4 className={styles.qDark}>Member Notes (Private)</h4>
                <textarea 
                  className={styles.notesInput} 
                  placeholder="Notes about this member..." 
                  value={selectedMember.adminNotes}
                  onChange={updateNotes}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>Select a member.</div>
        )}
      </div>
    </>
  );
}

function TablesTab() {
  const [selectedId, setSelectedId] = useState(null);
  const [tables, setTables] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  
  // Dedicated state for creating a new table
  const [isCreating, setIsCreating] = useState(false);
  const [draftTable, setDraftTable] = useState(null);

  // Fetch Tables
  useEffect(() => {
    const q = query(collection(db, 'tables'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTables(data);
      if (data.length > 0 && !selectedId && !isCreating) {
        setSelectedId(data[0].id);
      }
    });
    return unsubscribe;
  }, [selectedId, isCreating]);

  // Fetch all approved members to invite to tables
  useEffect(() => {
    const q = query(collection(db, 'users'), where('status', '==', 'approved'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllMembers(data);
    });
    return unsubscribe;
  }, []);

  const selectedTable = tables.find(t => t.id === selectedId);

  // --- EXISTING TABLE HANDLERS ---
  const updateField = async (field, value) => {
    if (!selectedTable) return;
    await updateDoc(doc(db, 'tables', selectedTable.id), { [field]: value });
  };

  const setAttendance = async (memberId, state) => {
    if (!selectedTable) return;
    const newAttendees = selectedTable.attendees.map(a => a.id === memberId ? { ...a, state } : a);
    await updateDoc(doc(db, 'tables', selectedTable.id), { attendees: newAttendees });
  };

  const addAttendeeToExisting = async (member) => {
    if (!selectedTable) return;
    const newAttendees = [...selectedTable.attendees, { id: member.id, name: member.fullName, state: 'pending' }];
    await updateDoc(doc(db, 'tables', selectedTable.id), { attendees: newAttendees });
  };

  const removeAttendeeFromExisting = async (memberId) => {
    if (!selectedTable) return;
    const newAttendees = selectedTable.attendees.filter(a => a.id !== memberId);
    await updateDoc(doc(db, 'tables', selectedTable.id), { attendees: newAttendees });
  };

  const toggleStatus = async () => {
    if (!selectedTable) return;
    const newStatus = selectedTable.status === 'Completed' ? 'Upcoming' : 'Completed';
    await updateDoc(doc(db, 'tables', selectedTable.id), { status: newStatus });
  };

  // --- DRAFT TABLE HANDLERS ---
  const handleInitCreate = () => {
    setIsCreating(true);
    setSelectedId(null);
    setDraftTable({
      title: '',
      date: '',
      time: '',
      venue: '',
      status: 'Upcoming',
      agenda: '',
      preparation: '',
      adminNotes: '',
      hostId: '',
      attendees: []
    });
  };

  const updateDraftField = (field, value) => {
    setDraftTable(prev => ({ ...prev, [field]: value }));
  };

  const addAttendeeToDraft = (member) => {
    setDraftTable(prev => ({
      ...prev,
      attendees: [...prev.attendees, { id: member.id, name: member.fullName, state: 'pending' }]
    }));
  };

  const removeAttendeeFromDraft = (memberId) => {
    setDraftTable(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a.id !== memberId)
    }));
  };

  const handleScheduleTable = async () => {
    if (!draftTable.title) return; // Prevent empty title
    try {
      const docRef = await addDoc(collection(db, 'tables'), {
        ...draftTable,
        createdAt: serverTimestamp()
      });
      setSelectedId(docRef.id);
      setIsCreating(false);
      setDraftTable(null);
    } catch (e) {
      console.error("Error creating table: ", e);
    }
  };

  const handleSelectSidebar = (id) => {
    setIsCreating(false);
    setDraftTable(null);
    setSelectedId(id);
  };

  // Helpers for uninvited members
  const uninvitedMembersExisting = selectedTable 
    ? allMembers.filter(m => !selectedTable.attendees.find(a => a.id === m.id))
    : [];

  const uninvitedMembersDraft = draftTable
    ? allMembers.filter(m => !draftTable.attendees.find(a => a.id === m.id))
    : [];

  return (
    <>
      <div className={styles.listColumn}>
        <div className={styles.listHeader}>
          <span className={styles.num}>TABLES ({tables.length})</span>
        </div>
        <div className={styles.list}>
          {tables.map(table => (
            <div key={table.id} className={`${styles.listItem} ${selectedId === table.id && !isCreating ? styles.selected : ''}`} onClick={() => handleSelectSidebar(table.id)}>
              <div className={styles.listMeta}>
                <span className={styles.listDate}>{table.date}</span>
                <span className={styles.listStatus}>{table.status}</span>
              </div>
              <h3 className={styles.listName}>{table.title}</h3>
              <p className={styles.listCat}>{table.attendees.length} Members invited</p>
            </div>
          ))}
        </div>
        <button className={styles.createTableBtn} onClick={handleInitCreate}>+ Create Table</button>
      </div>

      <div className={styles.dossierColumn}>
        {/* --- DRAFT (CREATING) VIEW --- */}
        {isCreating && draftTable ? (
          <div className={styles.dossierInner}>
            <div className={styles.dossierHeader}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  className={styles.titleInput} 
                  value={draftTable.title}
                  onChange={(e) => updateDraftField('title', e.target.value)}
                  placeholder="Session Title"
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input 
                    className={styles.dateInput} 
                    value={draftTable.date}
                    onChange={(e) => updateDraftField('date', e.target.value)}
                    placeholder="Date (e.g. Oct 25)"
                  />
                  <input 
                    className={styles.dateInput} 
                    value={draftTable.time}
                    onChange={(e) => updateDraftField('time', e.target.value)}
                    placeholder="Time (e.g. 7:00 PM)"
                  />
                  <input 
                    className={styles.dateInput} 
                    value={draftTable.venue}
                    onChange={(e) => updateDraftField('venue', e.target.value)}
                    placeholder="Venue (e.g. Zoom)"
                  />
                </div>
              </div>
              <div className={styles.actions}>
                <button 
                  className={styles.btnApprove} 
                  onClick={handleScheduleTable}
                  style={{ opacity: draftTable.title ? 1 : 0.5 }}
                  disabled={!draftTable.title}
                >
                  Schedule Table
                </button>
              </div>
            </div>

            <div className={styles.dossierContent}>
              <div className={styles.notesSection} style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                <h4 className={styles.qDark}>Agenda</h4>
                <textarea 
                  className={styles.notesInput} 
                  placeholder="Outline the talking points..." 
                  value={draftTable.agenda}
                  onChange={(e) => updateDraftField('agenda', e.target.value)}
                />
              </div>

              <div className={styles.notesSection} style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                <h4 className={styles.qDark}>Preparation (What they have to do)</h4>
                <textarea 
                  className={styles.notesInput} 
                  style={{ minHeight: '80px' }}
                  placeholder="What should members prepare or read before attending?" 
                  value={draftTable.preparation}
                  onChange={(e) => updateDraftField('preparation', e.target.value)}
                />
              </div>

              <div className={styles.qaGroup}>
                <h4 className={styles.qDark}>Select Invites</h4>
                
                {uninvitedMembersDraft.length > 0 && (
                  <div className={styles.inviteSection}>
                    <h5 className={styles.q} style={{ marginBottom: '8px' }}>Available Members</h5>
                    <div className={styles.attendeeList}>
                      {uninvitedMembersDraft.map(m => (
                        <div key={m.id} className={styles.attendeeRow} style={{ padding: '8px 16px', background: 'transparent' }}>
                          <span className={styles.attName} style={{ fontSize: '14px', fontWeight: 500 }}>{m.fullName}</span>
                          <button className={styles.attBtn} style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }} onClick={() => addAttendeeToDraft(m)}>
                            + Invite
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.attendeeList} style={{ marginTop: '16px' }}>
                  <h5 className={styles.q} style={{ marginBottom: '8px' }}>Currently Invited ({draftTable.attendees.length})</h5>
                  {draftTable.attendees.length === 0 && <p className={styles.a} style={{ fontSize: '13px', color: '#888' }}>No one invited yet.</p>}
                  {draftTable.attendees.map(att => (
                    <div key={att.id} className={styles.attendeeRow}>
                      <span className={styles.attName}>
                        {att.name}
                        {draftTable.hostId === att.id && <span style={{marginLeft: '8px', padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px', fontSize: '11px', fontWeight: 600}}>HOST</span>}
                      </span>
                      <div className={styles.attToggles}>
                        {draftTable.hostId !== att.id && (
                          <button className={styles.attBtn} style={{ border: 'none', color: 'var(--accent)' }} onClick={() => updateDraftField('hostId', att.id)}>Make Host</button>
                        )}
                        <button className={styles.attBtn} style={{ border: 'none', color: '#cb2431' }} onClick={() => removeAttendeeFromDraft(att.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : selectedTable ? (
          /* --- EXISTING TABLE VIEW (Upcoming or Completed) --- */
          <div className={styles.dossierInner}>
            <div className={styles.dossierHeader}>
              <div style={{ flex: 1 }}>
                {selectedTable.status === 'Completed' ? (
                  <>
                    <h2 className={styles.dossierName}>{selectedTable.title}</h2>
                    <p className={styles.a}>{selectedTable.date} at {selectedTable.time} &mdash; {selectedTable.venue}</p>
                    <p className={styles.a} style={{ marginTop: 8 }}><strong>Status:</strong> {selectedTable.status}</p>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      className={styles.titleInput} 
                      value={selectedTable.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Session Title"
                    />
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <input 
                        className={styles.dateInput} 
                        value={selectedTable.date}
                        onChange={(e) => updateField('date', e.target.value)}
                        placeholder="Date (e.g. Oct 25)"
                      />
                      <input 
                        className={styles.dateInput} 
                        value={selectedTable.time}
                        onChange={(e) => updateField('time', e.target.value)}
                        placeholder="Time (e.g. 7:00 PM)"
                      />
                      <input 
                        className={styles.dateInput} 
                        value={selectedTable.venue}
                        onChange={(e) => updateField('venue', e.target.value)}
                        placeholder="Venue (e.g. Zoom)"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.actions}>
                <button 
                  className={selectedTable.status === 'Completed' ? styles.btnDecline : styles.btnApprove} 
                  onClick={toggleStatus}
                >
                  {selectedTable.status === 'Completed' ? 'Reopen Session' : 'Mark as Completed \u2713'}
                </button>
              </div>
            </div>

            <div className={styles.dossierContent}>
              
              {selectedTable.status === 'Completed' ? (
                /* READ-ONLY PREVIEW */
                <div className={styles.summaryBox}>
                  <div className={styles.summarySection}>
                    <h4 className={styles.qDark}>Agenda</h4>
                    <pre className={styles.summaryText}>{selectedTable.agenda || 'No agenda provided.'}</pre>
                  </div>

                  <div className={styles.summarySection}>
                    <h4 className={styles.qDark}>Preparation / Action Items</h4>
                    <pre className={styles.summaryText}>{selectedTable.preparation || 'No preparation requested.'}</pre>
                  </div>
                  
                  <div className={styles.summarySection}>
                    <h4 className={styles.qDark}>Session Notes</h4>
                    <pre className={styles.summaryText}>{selectedTable.adminNotes || 'No notes provided.'}</pre>
                  </div>

                  <div className={styles.summarySection}>
                    <h4 className={styles.qDark}>Attendance Summary</h4>
                    <div className={styles.attendanceSummaryGrid}>
                      <div>
                        <h5 className={styles.q}>Present</h5>
                        <ul className={styles.summaryList}>
                          {selectedTable.attendees.filter(a => a.state === 'present').map(a => (
                            <li key={a.id}>{a.name}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className={styles.q}>Absent</h5>
                        <ul className={styles.summaryList}>
                          {selectedTable.attendees.filter(a => a.state === 'absent').map(a => (
                            <li key={a.id}>{a.name}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className={styles.q}>Pending/No Show</h5>
                        <ul className={styles.summaryList}>
                          {selectedTable.attendees.filter(a => a.state === 'pending').map(a => (
                            <li key={a.id}>{a.name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* UPCOMING MODE: EDITABLE & ATTENDANCE TRACKING */
                <>
                  <div className={styles.notesSection} style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                    <h4 className={styles.qDark}>Agenda</h4>
                    <textarea 
                      className={styles.notesInput} 
                      placeholder="Outline the talking points..." 
                      value={selectedTable.agenda || ''}
                      onChange={(e) => updateField('agenda', e.target.value)}
                    />
                  </div>

                  <div className={styles.notesSection} style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                    <h4 className={styles.qDark}>Preparation (What they have to do)</h4>
                    <textarea 
                      className={styles.notesInput} 
                      style={{ minHeight: '80px' }}
                      placeholder="What should members prepare or read before attending?" 
                      value={selectedTable.preparation || ''}
                      onChange={(e) => updateField('preparation', e.target.value)}
                    />
                  </div>

                  <div className={styles.qaGroup}>
                    <h4 className={styles.qDark}>Track Attendance</h4>
                    
                    {uninvitedMembersExisting.length > 0 && (
                      <div className={styles.inviteSection}>
                        <h5 className={styles.q} style={{ marginBottom: '8px' }}>Available Members</h5>
                        <div className={styles.attendeeList}>
                          {uninvitedMembersExisting.map(m => (
                            <div key={m.id} className={styles.attendeeRow} style={{ padding: '8px 16px', background: 'transparent' }}>
                              <span className={styles.attName} style={{ fontSize: '14px', fontWeight: 500 }}>{m.fullName}</span>
                              <button className={styles.attBtn} style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }} onClick={() => addAttendeeToExisting(m)}>
                                + Invite
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={styles.attendeeList} style={{ marginTop: '16px' }}>
                      <h5 className={styles.q} style={{ marginBottom: '8px' }}>Roster ({selectedTable.attendees.length})</h5>
                      {selectedTable.attendees.length === 0 && <p className={styles.a} style={{ fontSize: '13px', color: '#888' }}>No one invited.</p>}
                      {selectedTable.attendees.map(att => (
                        <div key={att.id} className={styles.attendeeRow}>
                          <span className={styles.attName}>
                            {att.name}
                            {selectedTable.hostId === att.id && <span style={{marginLeft: '8px', padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px', fontSize: '11px', fontWeight: 600}}>HOST</span>}
                          </span>
                          <div className={styles.attToggles}>
                            {selectedTable.hostId !== att.id && (
                              <button className={styles.attBtn} style={{ border: 'none', color: 'var(--accent)' }} onClick={() => updateField('hostId', att.id)}>Make Host</button>
                            )}
                            <button 
                              className={`${styles.attBtn} ${att.state === 'present' ? styles.attPresent : ''}`}
                              onClick={() => setAttendance(att.id, 'present')}
                            >
                              Present
                            </button>
                            <button 
                              className={`${styles.attBtn} ${att.state === 'absent' ? styles.attAbsent : ''}`}
                              onClick={() => setAttendance(att.id, 'absent')}
                            >
                              Absent
                            </button>
                            <button 
                              className={`${styles.attBtn} ${att.state === 'pending' ? styles.attPending : ''}`}
                              onClick={() => setAttendance(att.id, 'pending')}
                            >
                              Pending
                            </button>
                            <button className={styles.attBtn} style={{ marginLeft: '12px', border: 'none', color: '#cb2431' }} onClick={() => removeAttendeeFromExisting(att.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.notesSection}>
                    <h4 className={styles.qDark}>Table/Session Notes (Private)</h4>
                    <textarea 
                      className={styles.notesInput} 
                      placeholder="Notes about this session... (e.g. key takeaways, catering issues, etc.)" 
                      value={selectedTable.adminNotes}
                      onChange={(e) => updateField('adminNotes', e.target.value)}
                    />
                  </div>
                </>
              )}

            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>Select a table or create a new one.</div>
        )}
      </div>
    </>
  );
}


// --- MAIN APP ---

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inbox');

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className={styles.adminContainer}>
      
      {/* 1. MASTER SIDEBAR */}
      <div className={styles.masterSidebar}>
        <div className={styles.brand}>NAME&trade;</div>
        
        <nav className={styles.mainNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'inbox' ? styles.active : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'members' ? styles.active : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Members
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'tables' ? styles.active : ''}`}
            onClick={() => setActiveTab('tables')}
          >
            Tables
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.navItem}>Logout</button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'inbox' && <InboxTab />}
      {activeTab === 'members' && <MembersTab />}
      {activeTab === 'tables' && <TablesTab />}

    </div>
  );
}
