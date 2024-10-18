import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function NewProjectAdmin() {
  const [projectTitle, setProjectTitle] = useState('');
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
  const [experts, setExperts] = useState([]);
  const [chairmans, setChairmans] = useState([]);
  const [advisors, setAdvisors] = useState([]); // State to store experts


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

    // Fetch experts
    axios.get('http://localhost:9999/expert/getAll')
      .then(response => {
        setExperts(response.data);
      })
      .catch(error => {
        console.error('Error fetching experts:', error);
        Swal.fire({
          title: 'ข้อผิดพลาด!',
          text: 'ไม่สามารถโหลดข้อมูลผู้ทรงคุณวุฒิได้',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      });

      axios.get('http://localhost:9999/advisor/getAll')
      .then(response => {
        if (Array.isArray(response.data)) {
          setAdvisors(response.data); // ตั้งค่า advisor เป็น array ที่ได้รับจาก API
        } else {
          throw new Error('ข้อมูลอาจารย์ไม่ถูกต้อง');
        }
      })
      .catch(error => {
        console.error('Error fetching advisor:', error);
        Swal.fire({
          title: 'ข้อผิดพลาด!',
          text: 'ไม่สามารถโหลดข้อมูลอาจารย์ที่ปรึกษาได้',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      });

      axios.get('http://localhost:9999/chairman/getAll')
      .then(response => {
        if (Array.isArray(response.data)) {
          setChairmans(response.data); // ตั้งค่า chairman เป็น array ที่ได้รับจาก API
        } else {
          throw new Error('ข้อมูลประธานไม่ถูกต้อง');
        }
      })
      .catch(error => {
        console.error('Error fetching chairman:', error);
        Swal.fire({
          title: 'ข้อผิดพลาด!',
          text: 'ไม่สามารถโหลดข้อมูลประธานได้',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      });
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

        // Ensure you are using the IDs from the state variables
        const projectResponse = await axios.post('http://localhost:9999/project/saveAdmin', {
            project_title: projectTitle,
            school_year: schoolYear,
            development_type: developmentType,
            id_advisor: advisor, // Ensure advisor ID is correctly selected
            id_chairman: chairman, // Ensure chairman ID is correctly selected
            id_expert: expert, // Ensure expert ID is correctly selected
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

        // Reset the form fields
        setProjectTitle('');
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
            window.location.href = `/manage-project-admin`;
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
    <div className="p-4 pl-72 bg-gray-100 min-h-screen">
      <main className="mt-8 container mx-auto w-1/2 bg-white shadow-lg p-6 rounded-md">
        <h1 className="text-2xl font-semibold mb-4">เพิ่มข้อมูลโครงงาน</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="projectTitle" className="block text-gray-700">ชื่อโครงงาน</label>
            <input
              type="text"
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => {
                setProjectTitle(e.target.value);
                validateProjectTitle(e.target.value);
              }}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 ${
                titleError ? 'border-red-500' : ''
              }`}
            />
            {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="developmentType" className="block text-gray-700">ประเภทการพัฒนา</label>
            <select
              id="developmentType"
              value={developmentType}
              onChange={(e) => setDevelopmentType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            >
              <option value="">เลือกประเภทการพัฒนา</option>
              {developmentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="advisor" className="block text-gray-700">อาจารย์ที่ปรึกษา</label>
            <select
              id="advisor"
              value={advisor}
              onChange={(e) => setAdvisor(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            >
              <option value="">เลือกอาจารย์ที่ปรึกษา</option>
              {advisors.map((advisor) => (
                <option key={advisor.id_advisor} value={advisor.id_advisor}>{advisor.advisor_title}{advisor.advisor_name} {advisor.advisor_lastname}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="chairman" className="block text-gray-700">ประธาน</label>
            <select
              id="chairman"
              value={chairman}
              onChange={(e) => setChairman(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            >
              <option value="">เลือกประธาน</option>
              {chairmans.map((chairman) => (
                <option key={chairman.id_chairman} value={chairman.id_chairman}>{chairman.chairman_title}{chairman.chairman_name} {chairman.chairman_lastname}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="expert" className="block text-gray-700">ผู้ทรงคุณวุฒิ</label>
            <select
              id="expert"
              value={expert}
              onChange={(e) => setExpert(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            >
              <option value="">เลือกผู้ทรงคุณวุฒิ</option>
              {experts.map((exp) => (
                <option key={exp.id_expert} value={exp.id_expert}>{exp.expert_title}{exp.expert_name} {exp.expert_lastname}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="schoolYear" className="block text-gray-700">ปีการศึกษา</label>
            <select
              id="schoolYear"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            >
              <option value="">เลือกปีการศึกษา</option>
              {schoolYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {creators.map((creator, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700">ผู้แต่ง {index + 1}</label>
              <input
                type="text"
                value={creator.creator}
                onChange={(e) => handleCreatorChange(index, 'creator', e.target.value)}
                placeholder="ชื่อผู้แต่ง"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              />
              <input
                type="text"
                value={creator.idStudent}
                onChange={(e) => handleCreatorChange(index, 'idStudent', e.target.value)}
                placeholder="รหัสนักศึกษา"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              />
            </div>
          ))}
          <div className="mb-4">
            <label htmlFor="fileUpload" className="block text-gray-700">อัพโหลดไฟล์</label>
            <input
              type="file"
              id="fileUpload"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50"
          >
            {isSubmitting ? 'กำลังส่งข้อมูล...' : 'เพิ่มข้อมูล'}
          </button>
          {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
        </form>
      </main>
    </div>
  );
}

export default NewProjectAdmin;
