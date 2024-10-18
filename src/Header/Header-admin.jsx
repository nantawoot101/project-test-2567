import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useState } from 'react';

function HeaderAdmin() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const admin_id = sessionStorage.getItem('admin_id'); 

  const handleLogout = () => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการออกจากระบบหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        // ลบข้อมูลจาก sessionStorage
        sessionStorage.removeItem('admin_id');
        sessionStorage.removeItem("user");
  
        // นำทางกลับไปยังหน้าแรก (หรือหน้า login)
        navigate('/home');
  
        // รีเฟรชหน้าจอ
        window.location.reload();
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 p-6 flex flex-col items-start space-y-6 shadow-lg">
      <h1 className="text-white text-3xl font-extrabold mb-6">
        <i className="fas fa-user-shield"></i> แอดมิน
      </h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center space-x-2">
          <i className="fa-solid fa-chart-column"></i>
          <span>แดชบอร์ด</span>
        </Link>
        <Link to="/report" className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center space-x-2">
          <i className="fas fa-list"></i>
          <span>รายงานโครงงาน</span>
        </Link>

        {/* Dropdown for various management links */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center space-x-2 w-full text-left"
          >
            <i className="fas fa-caret-down"></i>
            <span>จัดการข้อมูล</span>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-full bg-white text-gray-900 rounded-md shadow-lg">
              <Link to="/student" className="block hover:bg-gray-200 px-3 py-2 rounded">
                <i className="fas fa-user-graduate"></i>
                <span>จัดการข้อมูลนักศึกษา</span>
              </Link>
              <Link to="/lecturer" className="block hover:bg-gray-200 px-3 py-2 rounded">
                <i className="fas fa-chalkboard-teacher"></i>
                <span>จัดการข้อมูลอาจารย์</span>
              </Link>
              <Link to="/advisor" className="block hover:bg-gray-200 px-3 py-2 rounded">
                <i className="fas fa-chalkboard-teacher"></i>
                <span>จัดการข้อมูลอาจารย์ที่ปรึกษา</span>
              </Link>
              <Link to="/chairman" className="block hover:bg-gray-200 px-3 py-2 rounded">
                <i className="fas fa-user-tie"></i>
                <span>จัดการข้อมูลประธาน</span>
              </Link>
              <Link to="/expert" className="block hover:bg-gray-200 px-3 py-2 rounded">
                <i className="fas fa-user-tie"></i>
                <span>จัดการข้อมูลผู้ทรงคุณวุฒิ</span>
              </Link>
            </div>
          )}
        </div>

        <Link to="/manage-project-admin" className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center space-x-2">
          <i className="fas fa-project-diagram"></i>
          <span>จัดการข้อมูลโครงงาน</span>
        </Link>

        <Link to={`/edit-admin/${admin_id}`} className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center space-x-2">
          <i className="fas fa-user-shield"></i>
          <span>แก้ไขข้อมูลแอดมิน</span>
        </Link>

        <button
          onClick={handleLogout}
          className="text-white hover:bg-red-600 px-3 py-2 rounded flex items-center space-x-2"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>ออกจากระบบ</span>
        </button>
      </nav>
    </div>
  );
}

export default HeaderAdmin;
