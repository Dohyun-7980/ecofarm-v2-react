
import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from './firebase'; // Firebase 설정 가져오기
import type { Greenhouse } from './types';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import LoginPage from './components/LoginPage'; // 로그인 페이지 컴포넌트 추가
import { PowerIcon, UserCircleIcon } from './components/icons';

type ModalType = 'expert' | 'analysis' | 'harvest' | 'addDevice' | null;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // 인증 상태 리스너
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // 로그아웃 시 데이터 초기화
      if (!currentUser) {
        setGreenhouses([]);
        setSelectedGreenhouseId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 로그인된 사용자의 온실 데이터 실시간 구독
  useEffect(() => {
    if (!user) return;

    const greenhousesCol = collection(db, 'greenhouses'); // 실제 컬렉션 이름으로 변경하세요.
    const unsubscribe = onSnapshot(greenhousesCol, (snapshot) => {
      const greenhousesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Greenhouse));
      setGreenhouses(greenhousesData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSelectGreenhouse = (id: string) => {
    setSelectedGreenhouseId(id);
  };

  const handleReturnToDashboard = () => {
    setSelectedGreenhouseId(null);
  };

  const handleUpdateGreenhouse = useCallback(async (updatedGreenhouse: Greenhouse) => {
    if (!user) return;
    const { id, ...dataToUpdate } = updatedGreenhouse;
    const greenhouseDoc = doc(db, 'greenhouses', id);
    await updateDoc(greenhouseDoc, dataToUpdate);
    // onSnapshot이 자동으로 UI를 업데이트하므로 setGreenhouses 호출 불필요
  }, [user]);

  const handleAddGreenhouse = async () => {
    if (!user) return;
    const name = prompt(`새 온실의 이름을 입력하세요:`, `새 온실 ${greenhouses.length + 1}`);
    if (name) {
      const newGreenhouse: Omit<Greenhouse, 'id'> = {
        name,
        plantingDate: new Date().toISOString().split('T')[0],
        sensorData: { temp: 25, rootTemp: 22, humidity: 60, dewPoint: 15.6, vpd: 1.17, co2: 400, isDay: true, wetBulbTemp: 19.5 },
        controlState: { activeMode: 'manual', manualSettings: {}, useExpertSettings: false, autoSubType: 'stable', jojoGaonRules: [] },
        devices: { fan: '배기 팬', circulation_fan: '순환 팬', heater: '난방기' },
        expertSettings: {
          day: { temp_min: 18, temp_max: 23, temp_diff_min: 3.0, temp_diff_max: 5.0 },
          night: { temp_min: 5, temp_max: 8, temp_diff_min: 3.0, temp_diff_max: 5.0 }
        }
      };
      await addDoc(collection(db, 'greenhouses'), newGreenhouse);
    }
  };

  const handleDeleteGreenhouse = async (id: string) => {
    if (!user) return;
    if (confirm(`정말로 이 온실을 삭제하시겠습니까?`)) {
      await deleteDoc(doc(db, 'greenhouses', id));
      if (selectedGreenhouseId === id) {
        setSelectedGreenhouseId(null);
      }
    }
  };

  const selectedGreenhouse = greenhouses.find(g => g.id === selectedGreenhouseId) || null;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-base-100 text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-base-300">
        <h1 className="text-3xl font-bold text-secondary">
          에코팜<span className="text-white"> 스마트 제어 v2.0</span>
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-white">관리자</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <UserCircleIcon className="w-10 h-10 text-gray-300" />
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-base-200 transition-colors">
            <PowerIcon className="w-6 h-6 text-red-500" />
          </button>
        </div>
      </header>
      <main>
        {selectedGreenhouse ? (
          <DetailView
            greenhouse={selectedGreenhouse}
            allGreenhouses={greenhouses}
            onReturn={handleReturnToDashboard}
            onUpdate={handleUpdateGreenhouse}
            onNavigate={handleSelectGreenhouse}
            activeModal={activeModal}
            setActiveModal={setActiveModal}
          />
        ) : (
          <Dashboard
            greenhouses={greenhouses}
            onSelect={handleSelectGreenhouse}
            onAdd={handleAddGreenhouse}
            onDelete={handleDeleteGreenhouse}
          />
        )}
      </main>
    </div>
  );
};

export default App;
