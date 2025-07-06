import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, UserRole, Job } from '../types';
import { mockJobs, mockUsers } from '../data/mockData';
import { findMatchingCandidates } from '../services/geminiService';

// Mock CVs received by HRD
const mockReceivedCVs = [
    { applicant: mockUsers.find(u => u.id === 1), job: mockJobs.find(j => j.id === 3) },
    { applicant: mockUsers.find(u => u.id === 4), job: mockJobs.find(j => j.id === 5) },
]

const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const isClient = user.role === UserRole.CLIENT;
  const isHrd = user.role === UserRole.HRD || user.role === UserRole.HRD_PREMIUM;
  const isPremiumHrd = user.role === UserRole.HRD_PREMIUM;

  const handleUpgrade = () => {
    alert("Upgrading to Premium... Payment of Rp. 100,000 successful! You now have access to AI Headhunting.");
    updateUser({ ...user, role: UserRole.HRD_PREMIUM });
  };
  
  const ProfileEditor = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold">Edit Profile</h3>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" defaultValue={user.name} className="mt-1 block w-full rounded-md border-gray-300 dark:border-navy-600 shadow-sm bg-gray-50 dark:bg-navy-700 p-2"/>
        </div>
        {isClient && (
            <>
            <div>
                <label className="block text-sm font-medium">Desired Job</label>
                <input type="text" defaultValue={user.desiredJob} className="mt-1 block w-full rounded-md border-gray-300 dark:border-navy-600 shadow-sm bg-gray-50 dark:bg-navy-700 p-2"/>
            </div>
            <div>
                <label className="block text-sm font-medium">Current Skills (comma separated)</label>
                <input type="text" defaultValue={user.currentSkills?.join(', ')} className="mt-1 block w-full rounded-md border-gray-300 dark:border-navy-600 shadow-sm bg-gray-50 dark:bg-navy-700 p-2"/>
            </div>
            </>
        )}
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">Save Changes</button>
    </div>
  );

  const HrdCvInbox = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold">Received CVs</h3>
        {mockReceivedCVs.filter(cv => cv.job?.postedBy === user.id).length > 0 ? (
        <div className="space-y-3">
            {mockReceivedCVs.filter(cv => cv.job?.postedBy === user.id).map((cv, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-navy-800 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">{cv.applicant?.name}</p>
                        <p className="text-sm text-gray-500">Applied for: {cv.job?.title}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full">Preview</button>
                        <button className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full">Download</button>
                    </div>
                </div>
            ))}
        </div>
        ) : (
            <p>No CVs received yet for your job postings.</p>
        )}
    </div>
  );

  const AiHeadhunter = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState('');

    const handleFindCandidates = async () => {
        setIsLoading(true);
        setResults('');
        const clientUsers = mockUsers.filter(u => u.role === UserRole.CLIENT);
        const matchResults = await findMatchingCandidates(user, clientUsers);
        setResults(matchResults);
        setIsLoading(false);
    }
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold">AI Headhunter (Premium)</h3>
            <p>Find the best candidates based on your requirements.</p>
            <p><span className="font-semibold">Your requirements:</span> {user.requiredSkills?.join(', ')}</p>
            <button onClick={handleFindCandidates} disabled={isLoading} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50">
                {isLoading ? 'Searching...' : 'Find Matching Candidates'}
            </button>
            {isLoading && <div className="text-center p-4">Loading AI analysis...</div>}
            {results && <div className="mt-4 p-4 bg-gray-50 dark:bg-navy-800 rounded-lg prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />}
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
      {/* Left Panel */}
      <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg p-6 text-center">
            <img src={user.profilePicture} alt={user.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-blue-500 dark:ring-blue-400"/>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{isClient ? user.currentJob : user.company}</p>
            <button className="text-sm mt-2 text-blue-500 hover:underline">Change Picture</button>
          </div>
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg p-6">
              <nav className="space-y-1">
                  <a onClick={() => setActiveTab('profile')} className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${activeTab === 'profile' ? 'bg-blue-100 dark:bg-navy-800 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-navy-800/50'}`}>Profile Details</a>
                  {isHrd && <a onClick={() => setActiveTab('cvs')} className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${activeTab === 'cvs' ? 'bg-blue-100 dark:bg-navy-800 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-navy-800/50'}`}>Received CVs</a>}
                  {isPremiumHrd && <a onClick={() => setActiveTab('ai-headhunter')} className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${activeTab === 'ai-headhunter' ? 'bg-blue-100 dark:bg-navy-800 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-navy-800/50'}`}>AI Headhunter</a>}
              </nav>
          </div>
          {isHrd && !isPremiumHrd && (
               <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-r-lg shadow-lg">
                    <h4 className="font-bold">Upgrade to Premium!</h4>
                    <p className="text-sm">Unlock AI Headhunting to find top talent instantly for only Rp. 100,000.</p>
                    <button onClick={handleUpgrade} className="mt-2 bg-yellow-500 text-white text-sm font-bold py-1 px-3 rounded hover:bg-yellow-600">Upgrade Now</button>
                </div>
          )}
      </div>

      {/* Right Panel */}
      <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-xl shadow-lg p-8">
        {activeTab === 'profile' && <ProfileEditor />}
        {activeTab === 'cvs' && isHrd && <HrdCvInbox />}
        {activeTab === 'ai-headhunter' && isPremiumHrd && <AiHeadhunter />}
      </div>
    </div>
  );
};

export default ProfilePage;
