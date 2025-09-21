const filmsList = document.getElementById("films");
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const runtime = document.getElementById("runtime");
const showtime = document.getElementById("showtime");
const description = document.getElementById("description");
const tickets = document.getElementById("ticket-num");
const filmList = document.getElementById("films")
const buyBtn = document.getElementById("buy-ticket");

let currentFilm = null;


fetch("http://localhost:3002/films")
  .then(res => res.json())
  .then(data => {
    console.log("Movies:", data); 
    data.forEach(film => renderFilm(film));
    if (data.length > 0) {
      showFilm(data[0]);
    }
  })
  .catch(err => console.error("Fetch error:", err));

function renderFilm(film) {
  const li = document.createElement("li");
  li.textContent = film.title;
  li.addEventListener("click", () => showFilm(film));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.style.color = "red";

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    deleteFilm(film.id, li);
  });

  li.appendChild(deleteBtn);
  filmList.appendChild(li);
};


function showFilm(film) {
  currentFilm = film;
  poster.src = film.poster;
  title.textContent = film.title;
  runtime.textContent = `${film.runtime} mins`;
  showtime.textContent = film.showtime;
  description.textContent = film.description;
  tickets.textContent = film.capacity - film.tickets_sold;
}


buyBtn.addEventListener("click", () => {
  if (!currentFilm) return;

  const available = currentFilm.capacity - currentFilm.tickets_sold;
  if (available > 0) {
    currentFilm.tickets_sold++;
    tickets.textContent = currentFilm.capacity - currentFilm.tickets_sold;

    
    fetch("http://localhost:3002/films", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets_sold: currentFilm.tickets_sold })
    });
  } else {
    alert("Sorry, tickets are sold out!");
  }

});




 