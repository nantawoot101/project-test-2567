import 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-6">
      <div className="container text-center">
        <div className="flex justify-center items-center space-x-1">
          <p className="text-sm hover:text-blue-300 transition duration-300 ease-in-out">
            © Copyright 2024, All Rights Reserved : สาขาวิชาเทคโนโลยีสารสนเทศ
          </p>
          <p className="text-sm hover:text-blue-300 transition duration-300 ease-in-out">
            คณะเทคโนโลยีสารสนเทศ
          </p>
          <p className="text-sm hover:text-blue-300 transition duration-300 ease-in-out">
            มหาวิทยาลัยราชภัฏมหาสารคาม 
          </p>
          <p className="text-sm hover:text-blue-300 transition duration-300 ease-in-out" >ต.ตลาด อ.เมือง จ.มหาสารคาม 44000 <br />
          </p>
          <p className="text-sm hover:text-blue-300 transition duration-300 ease-in-out" >โทรศัพท์ : 043-020-227</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
