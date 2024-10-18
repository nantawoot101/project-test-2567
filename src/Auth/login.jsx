import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [username_id, setUsername] = useState('');
  const [password_id, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username_id || !password_id) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
      });
      return;
    }

    try {
      let response;

      if (isAdmin) {
        response = await axios.post('http://localhost:9999/admin/login', {
          username: username_id,
          password: password_id,
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        response = await axios.post('http://localhost:9999/auth/login', {
          username_id,
          password_id,
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (response.status === 200) {
        console.log('เข้าสู่ระบบสำเร็จ:', response.data);
      
        const userData = {
          username: response.data.username || response.data.username_id,
          ...response.data,
        };
      
        if (isAdmin) {
          // บันทึก admin_id ลงใน sessionStorage ถ้าเป็นผู้ดูแลระบบ
          sessionStorage.setItem('admin_id', response.data.admin_id);
        }
      
        sessionStorage.setItem('user', JSON.stringify(userData));
      
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'ยินดีต้อนรับกลับ!',
        });
      
        if (isAdmin) {
          navigate('/home-admin');
          window.location.reload();
        } else {
          navigate('/home');
        }
      } else {
        setError(response.data.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบล้มเหลว',
          text: response.data.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        });
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-grow">
        <div
          className="relative w-1/2 bg-cover bg-center"
          style={{ backgroundImage: 'url(/public/img/IT.jpg)' }}
        >
          {/* รูปภาพเต็มพื้นที่ด้านซ้าย */}
        </div>
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200 bg-white">
            <div className="flex justify-center mb-6">
              <img src="/public/img/rmu.png" alt="Logo" className="w-32 h-auto" />
            </div>
            <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">เข้าสู่ระบบ</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  id="username"
                  value={username_id}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="กรุณากรอกชื่อผู้ใช้"
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password_id}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="กรุณากรอกรหัสผ่าน"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 py-2 flex items-center text-gray-600"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="admin" className="ml-2 text-sm text-gray-700">เข้าสู่ระบบในฐานะผู้ดูแลระบบ</label>
              </div>
              <div className="text-center mb-4">
                <Link to="/register" className="text-blue-600 hover:underline">คุณยังไม่มีบัญชีใช่หรือไม่? สมัครใหม่</Link>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                เข้าสู่ระบบ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
