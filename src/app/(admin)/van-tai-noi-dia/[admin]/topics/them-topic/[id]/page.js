"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTopic } from '../../../../../../api/CategoryAPIcalls';
import { usePathname } from 'next/navigation';

const NewTopic = () => {
  const pathname = usePathname();
  const categoryId = pathname.split('/').pop();
  const [name, setName] = useState('');
  const [urlName, setUrlName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const topic = { name, categoryId, url_name: urlName, description, icon };
    await createTopic(topic);
    router.push(`/van-tai-noi-dia/admin/topics/danh-sach-topic/${categoryId}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create New Topic</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Topic Name"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={urlName}
          onChange={(e) => setUrlName(e.target.value)}
          placeholder="URL Name"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="Icon"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Create</button>
      </form>
    </div>
  );
};
const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0070f2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
export default NewTopic;
