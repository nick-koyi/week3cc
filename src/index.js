// Your code here
const movieTitle = document.getElementById('films');
const imageContainer = document.querySelector('#imgcont');
const title = document.getElementById('title');
const runtime = document.getElementById('runtime');
const description = document.getElementById('film-info');
const showtime = document.getElementById('showtime');
const ticketNum = document.getElementById('ticket-num');
const ticketButton = document.getElementById('buy-ticket');

fetch('http://localhost:3000/films/1')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const dataValues = Object.values(data);
    let numberOfTickets = dataValues[3] - dataValues[5];

    const img = document.createElement('img');
    img.src = dataValues[7];
    img.setAttribute('alt', dataValues[1]);
    imageContainer.appendChild(img);
    title.textContent = dataValues[1];
    runtime.textContent = `${dataValues[2]} minutes`;
    description.textContent = dataValues[6];
    showtime.textContent = dataValues[4];
    ticketNum.textContent = numberOfTickets;
    //Buying Event Listener starts
    ticketButton.addEventListener('click', () => {
      if (numberOfTickets > 0) {
        numberOfTickets -= 1;
        fetch('http://localhost:3000/films/1', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tickets_sold: dataValues[5] + 1,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then(() => {
            // Update the ticket number on the frontend
            ticketNum.textContent = numberOfTickets;
          });
      } else {
        // Notify the user that the showing is sold out
        ticketButton.textContent = 'Sold Out';
      }
    });
    // Buying Event Listerner Ends
    fetch('http://localhost:3000/tickets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        film_id: dataValues[5] + 1,
        number_of_tickets: numberOfTickets,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        console.log(error);
      });
  });

//displaying poster
fetch('http://localhost:3000/films')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((film) => {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      const li = document.createElement('li');
      li.textContent = film.title;

      if (film.tickets_sold === film.capacity) {
        li.classList.add('film', 'item', 'sold-out');
      } else {
        li.classList.add('film', 'item');
      }

      li.appendChild(deleteButton);
      movieTitle.appendChild(li);

      function deleteFilm() {
        // Send a DELETE request to the server when the delete button is clicked
        fetch(`http://localhost:3000/films/${film.id}`, {
          method: 'DELETE',
        }).then((response) => {
          // Remove the film from the list if the DELETE request is successful
          li.remove();
        });
      }
      deleteButton.addEventListener('click', deleteFilm);
    });
  });
