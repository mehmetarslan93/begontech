import React, { useState } from 'react';

// Akıllı Ev Simülasyonu - BegonTech
const SmartHomeSim = () => {
  // Cihaz durumları için state
  const [devices, setDevices] = useState({
    livingRoom: {
      light: false,
      tv: false,
      ac: false
    },
    kitchen: {
      light: false,
      waterSensor: 'Normal'
    },
    bedroom: {
      blinds: false,
      nightMode: false
    },
    entrance: {
      doorLock: true // Varsayılan olarak kilitli
    },
    balcony: {
      light: false,
      irrigation: false
    }
  });

  // Aktif panel state'i
  const [activePanel, setActivePanel] = useState(null);

  // Cihaz durumunu güncelleme fonksiyonu
  const updateDevice = (room, device, value) => {
    setDevices(prev => ({
      ...prev,
      [room]: {
        ...prev[room],
        [device]: value
      }
    }));
  };

  // Senaryo fonksiyonları
  const executeScenario = (scenario) => {
    switch (scenario) {
      case 'homeArrival':
        setDevices({
          livingRoom: { light: true, tv: true, ac: true },
          kitchen: { light: true, waterSensor: 'Normal' },
          bedroom: { blinds: true, nightMode: false },
          entrance: { doorLock: false },
          balcony: { light: true, irrigation: false }
        });
        break;
      
      case 'homeDeparture':
        setDevices({
          livingRoom: { light: false, tv: false, ac: false },
          kitchen: { light: false, waterSensor: 'Normal' },
          bedroom: { blinds: false, nightMode: false },
          entrance: { doorLock: true },
          balcony: { light: false, irrigation: false }
        });
        break;
      
      case 'nightMode':
        setDevices(prev => ({
          livingRoom: { light: false, tv: false, ac: prev.livingRoom.ac },
          kitchen: { light: false, waterSensor: prev.kitchen.waterSensor },
          bedroom: { blinds: false, nightMode: true },
          entrance: { doorLock: true },
          balcony: { light: false, irrigation: prev.balcony.irrigation }
        }));
        break;
      
      default:
        break;
    }
    setActivePanel(null); // Panel'i kapat
  };

  // Hotspot bileşeni
  const Hotspot = ({ position, room, label, onClick }) => (
    <div
      className="absolute w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-600 hover:scale-110 transition-all duration-200 animate-pulse"
      style={{ left: position.x, top: position.y }}
      onClick={() => onClick(room)}
      title={label}
    >
      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
    </div>
  );

  // Kontrol paneli bileşeni
  const ControlPanel = ({ room, onClose }) => {
    const roomData = devices[room];
    
    const roomConfigs = {
      livingRoom: {
        title: 'Oturma Odası',
        controls: [
          { key: 'light', label: 'Işık', type: 'toggle' },
          { key: 'tv', label: 'TV', type: 'toggle' },
          { key: 'ac', label: 'Klima', type: 'info', info: 'Otomatik mod aktif' }
        ]
      },
      kitchen: {
        title: 'Mutfak',
        controls: [
          { key: 'light', label: 'Işık', type: 'toggle' },
          { key: 'waterSensor', label: 'Su Sensörü', type: 'info', info: 'Durum: Normal' }
        ]
      },
      bedroom: {
        title: 'Yatak Odası',
        controls: [
          { key: 'blinds', label: 'Panjur', type: 'toggle' },
          { key: 'nightMode', label: 'Gece Modu', type: 'toggle' }
        ]
      },
      entrance: {
        title: 'Giriş / Koridor',
        controls: [
          { key: 'doorLock', label: 'Kapı Kilidi', type: 'toggle', invert: true }
        ]
      },
      balcony: {
        title: 'Balkon',
        controls: [
          { key: 'light', label: 'Işık', type: 'toggle' },
          { key: 'irrigation', label: 'Sulama Sistemi', type: 'info', info: 'Otomatik program' }
        ]
      }
    };

    const config = roomConfigs[room];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
          {/* Kapatma butonu */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
          
          {/* Panel başlığı */}
          <h3 className="text-xl font-bold text-brand-dark mb-6">{config.title}</h3>
          
          {/* Kontroller */}
          <div className="space-y-4">
            {config.controls.map((control) => (
              <div key={control.key} className="flex items-center justify-between">
                <span className="text-gray-700">{control.label}</span>
                
                {control.type === 'toggle' ? (
                  <button
                    onClick={() => {
                      const currentValue = roomData[control.key];
                      const newValue = control.invert ? !currentValue : !currentValue;
                      updateDevice(room, control.key, newValue);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      (control.invert ? !roomData[control.key] : roomData[control.key])
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {control.invert 
                      ? (roomData[control.key] ? 'Kilitli' : 'Açık')
                      : (roomData[control.key] ? 'Açık' : 'Kapalı')
                    }
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">{control.info}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            Akıllı Ev Simülasyonu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Evinizdeki akıllı cihazları mavi noktaları tıklayarak kontrol edin
          </p>
        </div>

        {/* Senaryo Butonları */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => executeScenario('homeArrival')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            🏠 Eve Geldim
          </button>
          <button
            onClick={() => executeScenario('homeDeparture')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            🚪 Evden Çıktım
          </button>
          <button
            onClick={() => executeScenario('nightMode')}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            🌙 Gece Modu
          </button>
        </div>

        {/* Ev Maketi */}
        <div className="relative max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Ev görseli */}
          <div className="relative w-full h-96 md:h-[540px] bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src="assets/images/smart-home/house-sim.png"
              alt="Akıllı Ev Planı"
              className="absolute inset-0 w-full h-full object-cover select-none"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              draggable={false}
            />
            {/* Hotspotlar - Yeni pozisyonlar örnek görsele göre */}
            <Hotspot
              position={{ x: '62%', y: '54%' }}
              room="livingRoom"
              label="Oturma Odası"
              onClick={setActivePanel}
            />
            <Hotspot
              position={{ x: '52%', y: '22%' }}
              room="kitchen"
              label="Mutfak"
              onClick={setActivePanel}
            />
            <Hotspot
              position={{ x: '82%', y: '48%' }}
              room="bedroom"
              label="Yatak Odası"
              onClick={setActivePanel}
            />
            <Hotspot
              position={{ x: '40%', y: '48%' }}
              room="entrance"
              label="Giriş / Koridor"
              onClick={setActivePanel}
            />
            <Hotspot
              position={{ x: '50%', y: '82%' }}
              room="balcony"
              label="Balkon"
              onClick={setActivePanel}
            />
          </div>

          {/* Durum Göstergeleri */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  Object.values(devices.livingRoom).some(Boolean) ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span>Oturma Odası</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  devices.kitchen.light ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span>Mutfak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  Object.values(devices.bedroom).some(Boolean) ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span>Yatak Odası</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  !devices.entrance.doorLock ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span>Giriş {devices.entrance.doorLock ? '(Kilitli)' : '(Açık)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kontrol Paneli */}
        {activePanel && (
          <ControlPanel
            room={activePanel}
            onClose={() => setActivePanel(null)}
          />
        )}

        {/* Bilgilendirme */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>💡 Mavi noktalara tıklayarak odaları kontrol edebilirsiniz</p>
        </div>
      </div>
    </div>
  );
};

export default SmartHomeSim;

/*
Notlar:
1. Bu bileşen API çağrılarına kolayca bağlanabilir (REST / WebSocket)
2. Daha fazla cihaz veya oda eklemek için devices state'ini ve roomConfigs'i genişletmek yeterli
3. UI daha ileri seviyede Framer Motion animasyonları ile geliştirilebilir
4. Hotspot pozisyonları gerçek ev planı görseline göre ayarlanmalı
5. Real-time cihaz durumu için WebSocket entegrasyonu eklenebilir
*/