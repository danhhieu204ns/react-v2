import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";

const styles = {
  container: {
    display: "flex",
    gap: "20px",
  },
  form: {
    border: "1px solid #ddd",
    padding: "20px",
    margin: "10px",
    borderRadius: "8px",
    maxWidth: "300px",
  },
  input: {
    margin: "5px 0",
    padding: "8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "5px",
  },
  result: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    minWidth: "200px",
  },
};

const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// useState
function CreateAuthorState({ onSubmit }) {
  const [authorInfo, setAuthorInfo] = useState({
    name: "",
    birthdate: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const handleChange = (key, value) => {
    setAuthorInfo({ ...authorInfo, [key]: value });
  };
  const handleSubmit = () => {
    const { name, birthdate, gender } = authorInfo;
    if (!name || !birthdate || !gender) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!isValidDate(birthdate)) {
      setError("Ngày sinh không đúng định dạng (YYYY-MM-DD)");
      return;
    }
    setError("");
    onSubmit(authorInfo);
  };

  return (
    <div style={styles.form}>
      <h3>Tạo mới tác giả (useState)</h3>
      <input
        style={styles.input}
        placeholder="Tên"
        value={authorInfo.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <input
        style={styles.input}
        placeholder="Ngày sinh (YYYY-MM-DD)"
        value={authorInfo.birthdate}
        onChange={(e) => handleChange("birthdate", e.target.value)}
      />
      <select
        style={styles.input}
        value={authorInfo.gender}
        onChange={(e) => handleChange("gender", e.target.value)}
      >
        <option value="">Chọn giới tính</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>
      {error && <div style={styles.error}>{error}</div>}
      <button style={styles.button} onClick={handleSubmit}>
        Tạo
      </button>
    </div>
  );
}

// Uncontrolled Component (useRef)
function CreateAuthorRef({ onSubmit }) {
  const nameRef = useRef();
  const birthdateRef = useRef();
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const name = nameRef.current.value;
    const birthdate = birthdateRef.current.value;

    if (!name || !birthdate) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!isValidDate(birthdate)) {
      setError("Ngày sinh không đúng định dạng (YYYY-MM-DD)");
      return;
    }

    setError("");
    onSubmit({ name, birthdate });
  };

  return (
    <div style={styles.form}>
      <h3>Tạo mới tác giả (useRef)</h3>
      <input style={styles.input} placeholder="Tên" ref={nameRef} />
      <input
        style={styles.input}
        placeholder="Ngày sinh (YYYY-MM-DD)"
        ref={birthdateRef}
      />
      {error && <div style={styles.error}>{error}</div>}
      <button style={styles.button} onClick={handleSubmit}>
        Tạo
      </button>
    </div>
  );
}

// React Hook Form
function CreateAuthorForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitForm = (data) => {
    onSubmit(data);
  };
  return (
    <div style={styles.form}>
      <h3>Tạo mới tác giả (React Hook Form)</h3>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <input
          style={styles.input}
          placeholder="Tên"
          {...register("name", { required: true })}
        />
        {errors.name && <div style={styles.error}>Tên là bắt buộc</div>}

        <input
          style={styles.input}
          placeholder="Ngày sinh (YYYY-MM-DD)"
          {...register("birthdate", {
            required: true,
            pattern: /^\d{4}-\d{2}-\d{2}$/,
          })}
        />
        {errors.birthdate && (
          <div style={styles.error}>Ngày sinh không đúng định dạng</div>
        )}
        <button style={styles.button} type="submit">
          Tạo
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [submittedData, setSubmittedData] = useState(null);
  const handleData = (data) => {
    setSubmittedData(data);
  };

  return (
    <div style={styles.container}>
      <div>
        <CreateAuthorState onSubmit={handleData} />
        <CreateAuthorRef onSubmit={handleData} />
        <CreateAuthorForm onSubmit={handleData} />
      </div>
      <div style={styles.result}>
        <h3>Kết quả:</h3>
        {submittedData ? (
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        ) : (
          <p>Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
}
