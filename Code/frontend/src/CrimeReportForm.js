import React, { useEffect, useState } from "react";
import "./CrimeReportForm.css";
import axios from "axios";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

const api = axios.create();
const CrimeReportForm = () => {
  const [formData, setFormData] = useState({
    DateReported: "",
    DateOccurred: "",
    TimeOccurred: "",
    RptDistNo: "",
    CrimeCode: "",
    CrimeCodeDesc: "",
    MOCode: "",
    VictimSex: "",
    VictimAge: "",
    VictimDescent: "",
    Status: "",
    WeaponUsed: "",
    Location: "",
    LAT: "",
    LON: "",
    AreaCode: "",
  });

  const [validAreaCode, setValidAreaCode] = useState([]);
  const [validCrimeCode, setValidCrimeCode] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [createdId, setCreatedId] = useState("");
  useEffect(() => {
    api.get("http://127.0.0.1:5000/validareacode", options).then((res) => {
      if (res.data) {
        console.log(res.data);
        setValidAreaCode(res.data.response);
      }
    });
    api.get("http://127.0.0.1:5000//validcrimecode", options).then((res) => {
      if (res.data) {
        console.log(res.data);
        setValidCrimeCode(res.data.response);
      }
    });
  }, []);

  useEffect(() => {
    // console.log(validAreaCode.includes(parseInt(formData.AreaCode, 10)));
    // console.log(validCrimeCode.includes(parseInt(formData.CrimeCode, 10)));
    console.log(formData.DateReported.toString());
    setIsValid(
      //   validCrimeCode.includes(parseInt(formData.CrimeCode, 10)) &&
      formData.DateReported.toString() !== "" &&
        formData.Location !== "" &&
        formData.AreaCode !== "" &&
        formData.CrimeCode !== ""
    );
  }, [formData, validAreaCode, validCrimeCode]);

  const handleInputChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
    api
      .post("http://127.0.0.1:5000/insertnewcase", formData, options)
      .then((response) => response.data)
      .then((data) => {
        console.log("Response from server:", data);
        setCreatedId(data.response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    window.location.reload();
  };

  return (
    <div className="formcontainer">
      <form onSubmit={handleSubmit}>
        <label>
          Date Reported:
          <input
            type="Date"
            name="DateReported"
            value={formData.DateReported}
            onChange={handleInputChange}
          />
        </label>

        {/* <label>
          Date Occurred:
          <input
            type="text"
            name="DateOccurred"
            value={formData.DateOccurred}
            onChange={handleInputChange}
          />
        </label> */}

        {/* <label>
          Time Occurred:
          <input
            type="text"
            name="TimeOccurred"
            value={formData.TimeOccurred}
            onChange={handleInputChange}
          />
        </label> */}

        {/* <label>
          Rpt Dist No:
          <input
            type="text"
            name="RptDistNo"
            value={formData.RptDistNo}
            onChange={handleInputChange}
          />
        </label> */}

        <label>
          Crime Code:
          <input
            type="Number"
            name="CrimeCode"
            value={formData.CrimeCode}
            onChange={handleInputChange}
          />
        </label>
        {/* 
        <label>
          Crime Code Desc:
          <input
            type="text"
            name="CrimeCodeDesc"
            value={formData.CrimeCodeDesc}
            onChange={handleInputChange}
          />
        </label> */}

        {/* <label>
          MO Code:
          <input
            type="text"
            name="MOCode"
            value={formData.MOCode}
            onChange={handleInputChange}
          />
        </label> */}

        {/* <label>
          Victim Sex:
          <select
            name="VictimSex"
            value={formData.VictimSex}
            onChange={handleInputChange}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </label> */}
        {/* 
        <label>
          Victim Age:
          <input
            type="text"
            name="VictimAge"
            value={formData.VictimAge}
            onChange={handleInputChange}
          />
        </label> */}
        {/* 
        <label>
          Victim Descent:
          <input
            type="text"
            name="VictimDescent"
            value={formData.VictimDescent}
            onChange={handleInputChange}
          />
        </label> */}

        {/* <label>
          Status:
          <input
            type="text"
            name="Status"
            value={formData.Status}
            onChange={handleInputChange}
          />
        </label> */}

        {/* <label>
          Weapon Used:
          <input
            type="Number"
            name="WeaponUsed"
            value={formData.WeaponUsed}
            onChange={handleInputChange}
          />
        </label> */}

        <label>
          Location:
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleInputChange}
          />
        </label>

        {/* <label>
          LAT:
          <input
            type="text"
            name="LAT"
            value={formData.LAT}
            onChange={handleInputChange}
          />
        </label>

        <label>
          LON:
          <input
            type="text"
            name="LON"
            value={formData.LON}
            onChange={handleInputChange}
          />
        </label> */}

        <label>
          Area Code:
          <input
            type="Number"
            name="AreaCode"
            value={formData.AreaCode}
            onChange={handleInputChange}
          />
        </label>
        {!isValid && <p style={{ color: "red" }}>Invalid input</p>}
        {!createdId == "" && (
          <div>Successfully created case with id {createdId}</div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CrimeReportForm;
