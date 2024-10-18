import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function NewProject() {
  const [projectTitle, setProjectTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [developmentType, setDevelopmentType] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [idStudent, setIdStudent] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [schoolYears, setSchoolYears] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [memberId, setMemberId] = useState('');
  const [chairman, setChairman] = useState('');
  const [expert, setExpert] = useState('');
  const [titleError, setTitleError] = useState('');
  const [creators, setCreators] = useState([
    { creator: '', idStudent: '' },
    { creator: '', idStudent: '' }
  ]);

  const advisors = [
    'อาจารย์ภาสกร ธนศิระธรรม',
    'อาจารย์อิสรา ชื่นตา',
    'อาจารย์มณีรัตน์ ผลประเสริฐ',
    'อาจารย์ชเนตตี พิมพ์สวรรค์',
    'อาจารย์บัณฑิต สุวรรณโท',
    'อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์',
    'อาจารย์ดร.วีระพน ภานุรักษ์',
    'อาจารย์วินัย โกหลำ',
    'อาจารย์สมร เหล็กกล้า'
  ];

  const chairmans = [
    'อาจารย์ภาสกร ธนศิระธรรม',
    'อาจารย์อิสรา ชื่นตา',
    'อาจารย์มณีรัตน์ ผลประเสริฐ',
    'อาจารย์ชเนตตี พิมพ์สวรรค์',
    'อาจารย์บัณฑิต สุวรรณโท',
    'อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์',
    'อาจารย์ดร.วีระพน ภานุรักษ์',
    'อาจารย์วินัย โกหลำ',
    'อาจารย์สมร เหล็กกล้า'
  ];

  const experts = [
    'อาจารย์ภาสกร ธนศิระธรรม',
    'อาจารย์อิสรา ชื่นตา',
    'อาจารย์มณีรัตน์ ผลประเสริฐ',
    'อาจารย์ชเนตตี พิมพ์สวรรค์',
    'อาจารย์บัณฑิต สุวรรณโท',
    'อาจารย์ดร.เดือนเพ็ญ ภานุรักษ์',
    'อาจารย์ดร.วีระพน ภานุรักษ์',
    'อาจารย์วินัย โกหลำ',
    'อาจารย์สมร เหล็กกล้า'
  ];

  const developmentTypes = [
    'การพัฒนาเว็บ',
    'การพัฒนาแอปมือถือ',
    'การพัฒนาซอฟต์แวร์',
    'การวิเคราะห์ข้อมูล',
    'การพัฒนา AI'
  ];

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.member_id) {
        setMemberId(user.member_id.toString());
      }
    }

    const currentYear = new Date().getFullYear() + 544;
    const startYear = 2566;
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    setSchoolYears(years);
  }, []);

  const handleCreatorChange = (index, field, value) => {
    const newCreators = [...creators];
    newCreators[index][field] = value;
    setCreators(newCreators);
  };

  const validateProjectTitle = (value) => {
    const regex = /^[^\d]*$/; // Regex to disallow digits
    if (!regex.test(value)) {
      setTitleError('ชื่อโครงงานไม่ควรมีตัวเลข');
    } else {
      setTitleError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
  
    // Validate the project title again before submission
    validateProjectTitle(projectTitle);

    if (titleError) {
      Swal.fire({
        title: 'ข้อผิดพลาด!',
        text: titleError,
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
      setIsSubmitting(false);
      return; // Stop the submission if the title is invalid
    }

    try {
      const parsedMemberId = parseInt(memberId, 10);
      if (!memberId || isNaN(parsedMemberId)) {
        throw new Error('member_id is missing or invalid');
      }
  
      // Check if at least one creator is provided
      const validCreators = creators.filter((creatorData) => creatorData.creator.trim() !== '');
  
      if (validCreators.length === 0) {
        throw new Error('โปรดกรอกข้อมูลผู้แต่งอย่างน้อย 1 คน');
      }
  
      // Add a check to ensure that files are uploaded
      if (files.length === 0) {
        Swal.fire({
          title: 'ข้อผิดพลาด!',
          text: 'โปรดอัปโหลดไฟล์อย่างน้อย 1 ไฟล์',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
        setIsSubmitting(false);
        return; // Stop the submission if no files are uploaded
      }
  
      const projectResponse = await axios.post('http://localhost:9999/project/save', {
        project_title: projectTitle,
        member_id: parsedMemberId,
        school_year: schoolYear,
        development_type: developmentType,
        advisor: advisor,
        chairman: chairman,
        expert: expert
      });
  
      console.log('Project created:', projectResponse.data);
      const newProjectId = projectResponse.data.id_project;
      const newProjectTitle = projectResponse.data.project_title;
  
      // Send creator data after project creation
      for (const creatorData of validCreators) {
        const { creator, idStudent } = creatorData;
        if (creator) {
          const creatorResponse = await axios.post('http://localhost:9999/creator/save', {
            id_project: newProjectId,
            creator: creator,
            member_id: parsedMemberId,
            id_student: idStudent,
          });
  
          console.log('Creator data saved:', creatorResponse.data);
        }
      }
      
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('id_project', newProjectId);
        formData.append('name_project', newProjectTitle);
  
        try {
          const response = await axios.post('http://localhost:9999/docs/save', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Files uploaded:', response.data);
        } catch (uploadError) {
          console.error('Upload error:', uploadError.response ? uploadError.response.data : uploadError.message);
          Swal.fire({
            title: 'ข้อผิดพลาด!',
            text: 'การอัปโหลดไฟล์ล้มเหลว',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          });
          setErrorMessage('การอัปโหลดไฟล์ล้มเหลว');
        }
      }
  
      setProjectTitle('');
      setContent('');
      setFiles([]);
      setDevelopmentType('');
      setAdvisor('');
      setIdStudent('');
      setSchoolYear('');
      setChairman('');
      setExpert('');
      setCreators([{ creator: '', idStudent: '' }, { creator: '', idStudent: '' }]);
  
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'โปรเจกต์และไฟล์ถูกเพิ่มแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      }).then(() => {
        window.location.href = `/manage-project/${parsedMemberId}`;
      });
  
    } catch (error) {
      console.error('Error response data:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'ข้อผิดพลาด!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
      setErrorMessage('การส่งข้อมูลล้มเหลว');
    }
  
    setIsSubmitting(false);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <main className="mt-8 container mx-auto w-1/2">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl text-center font-semibold mb-4">เพิ่มโครงงาน</h2>
          <div>
          <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-1">ชื่อโครงงาน</label>
          <input
            type="text"
            id="projectTitle"
            value={projectTitle}
            onChange={(e) => {
              setProjectTitle(e.target.value);
              validateProjectTitle(e.target.value); // Validate on change
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {titleError && <p className="mt-2 text-sm text-red-600">{titleError}</p>}
        </div>
          {creators.map((creatorData, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`creator-${index}`}>
                ผู้แต่ง {index + 1}
              </label>
              <input
                id={`creator-${index}`}
                type="text"
                value={creatorData.creator}
                onChange={(e) => handleCreatorChange(index, 'creator', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2" htmlFor={`idStudent-${index}`}>
                รหัสนักศึกษา {index + 1}
              </label>
              <input
                id={`idStudent-${index}`}
                type="text"
                value={creatorData.idStudent}
                onChange={(e) => handleCreatorChange(index, 'idStudent', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="developmentType">
              ประเภทการพัฒนา
            </label>
            <select
              id="developmentType"
              value={developmentType}
              onChange={(e) => setDevelopmentType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">-- โปรดเลือกประเภทการพัฒนา --</option>
              {developmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="advisor">
              อาจารย์ที่ปรึกษา
            </label>
            <select
              id="advisor"
              value={advisor}
              onChange={(e) => setAdvisor(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">-- โปรดเลือกอาจารย์ที่ปรึกษา --</option>
              {advisors.map((advisor) => (
                <option key={advisor} value={advisor}>
                  {advisor}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="chairman">
              ประธาน
            </label>
            <select
              id="chairman"
              value={chairman}
              onChange={(e) => setChairman(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
             <option value="">-- โปรดเลือกประธาน --</option>
              {chairmans.map((chairman) => (
                <option key={chairman} value={chairman}>
                  {chairman}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expert">
              ผู้ทรงคุณวุฒิ
            </label>
            <select
              id="expert"
              value={expert}
              onChange={(e) => setExpert(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">-- โปรดเลือกผู้ทรงคุณวุฒิ --</option>
              {experts.map((expert) => (
                <option key={expert} value={expert}>
                  {expert}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolYear">
              ปีการศึกษา
            </label>
            <select
              id="schoolYear"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">-- โปรดเลือกปีการศึกษา --</option>
              {schoolYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="files">
              ไฟล์แนบ
            </label>
            <input
              id="files"
              type="file"
              onChange={handleFileChange}
              multiple
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 focus:outline-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'กำลังส่ง...' : 'เพิ่มโครงงาน'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default NewProject;
