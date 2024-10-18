import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // ดึงข้อมูลผู้ใช้จาก sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));
  const member_id = user ? user.member_id : null;
  const profileImageUrl = user ? user.profile_image : null;
  const role_id = user ? user.role_id : null;
  const member_name = user ? user.member_name : null; // ชื่อผู้ใช้

  // เก็บ member_id ใน sessionStorage
  useEffect(() => {
    if (member_id) {
      sessionStorage.setItem("member_id", member_id);
    }
  }, [member_id]);

  const handleLogout = () => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการออกจากระบบหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("member_id"); // ลบ member_id ด้วย
        navigate("/home");
        window.location.reload();
      }
    });
  };

  const isLoggedIn = !!sessionStorage.getItem("user");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          <i className="fa-solid fa-book"></i>{" "}
          ระบบฐานข้อมูลโครงงานเทคโนโลยีสารสนเทศ
        </Link>
        <nav className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/" className="text-white hover:underline">
                หน้าแรก
              </Link>
              <Link to="/register" className="text-white hover:underline">
                ลงทะเบียน
              </Link>
              <Link to="/login" className="text-white hover:underline">
                เข้าสู่ระบบ
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-blue-600 font-bold">
                    {member_name ? member_name.charAt(0) : "U"} {/* แสดงตัวอักษรย่อ */}
                  </div>
                )}
                <span>{member_name}</span> {/* แสดงชื่อผู้ใช้ */}
              </button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <Link
                    to={`/profile/${member_id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    โปรไฟล์
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
