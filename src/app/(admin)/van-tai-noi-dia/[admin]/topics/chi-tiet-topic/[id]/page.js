"use client"
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTopicById } from '../../../../../../api/CategoryAPIcalls';
import Link from 'next/link';

const TopicDetail = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTopic();
    }
  }, [id]);

  const fetchTopic = async () => {
    const data = await getTopicById(id);
    setTopic(data.data);
  };

  if (!topic) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Topic Detail</h1>
      <h1 style={styles.title}>Topic Detail</h1>
      <p style={styles.detail}><b>Name:</b> {topic.name}</p>
      <p style={styles.detail}><b>URL Name:</b> {topic.url_name}</p>
      <p style={styles.detail}><b>Description:</b> {topic.description}</p>
      <Link href={`/van-tai-noi-dia/admin/topics/sua-topic/edit/${topic.id}`} style={styles.link}>Edit</Link>
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
  detail: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  editLink: {
    display: 'block',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#0070f3',
    marginTop: '20px',
  },
  link: {
    display: 'inline-block',
    marginRight: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#0070f3',
    borderRadius: '5px',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
  },
  linkHover: {
    backgroundColor: '#005bb5',
  },
};
export default TopicDetail;
