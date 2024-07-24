import { useState, useEffect } from 'react';
import axios from 'axios';
import './ShelfPage.css';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

function ShelfPage() {
  const [shelfList, setShelfList] = useState([]);
  const [shelfItem, setShelfItem] = useState('');
  const [shelfUrl, setShelfUrl] = useState('');

  useEffect(() => {
    fetchShelf();
  }, []);

  const fetchShelf = () => {
    axios.get('/api/shelf').then((response) => {
      setShelfList(response.data);
    }).catch((error) => {
      console.log(error);
      alert('Something went wrong.');
    });
  }

  const addItem = (event) => {
    event.preventDefault();
    console.log(`${shelfItem} is being added to the shelf`);

    axios({
      method: 'POST',
      url: '/api/shelf',
      data: {
        item: shelfItem,
        url: shelfUrl
      }
    })
      .then((response) => {
        console.log('successful post', response);
        fetchShelf();
        setShelfItem('');
        setShelfUrl('');
      })
      .catch((error) => {
        console.log('post failed', error)
      })
  };

  const deleteItem = (id) => {
    axios({
      method: 'DELETE',
      url: `/api/shelf/${id}`
    })
      .then((response) => {
        console.log('delete item worked', response)
        fetchShelf();
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  


  return (
    <div className="container">
      <h2>Shelf</h2>
      <p>All of the available items can be seen here.</p>
      {
        shelfList.length === 0 && (
          <div>No items on the shelf</div>
        )
      }
      {
        shelfList.map(item => {
          return <div className="responsive" key={item.id}>
            <div className="gallery">
              <img src={item.image_url} alt={item.description} />
              <br />
              <div className="desc">{item.description}</div>
              <div style={{ textAlign: 'center', padding: '5px' }}>
                <button style={{ cursor: 'pointer' }} onClick={() => deleteItem(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        })
      }
      <br />
      <div className="addToShelf">
        <form onSubmit={addItem}>
          <input placeholder="Description" onChange={(evt) => setShelfItem(evt.target.value)} value={shelfItem} ></input>
          <input placeholder="URL" onChange={(evt) => setShelfUrl(evt.target.value)} value={shelfUrl} ></input>
          <button type="submit">Add To Shelf</button>
        </form>
      </div>
      <div className="clearfix"></div>
    </div>
  );
}

export default ShelfPage;
