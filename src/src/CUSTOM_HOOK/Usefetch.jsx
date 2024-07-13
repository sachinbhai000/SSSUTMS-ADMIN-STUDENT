  import { useState, useEffect } from 'react';
  import axios from 'axios';

  const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!url) return;

      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(url);
          setData(response.data);
          console.log(response.data,"dataaaaaaaaa")
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [url]);

    return { data, loading, error };
  };
  export default useFetch;

  
  
