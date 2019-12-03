const dialog = document.querySelector("dialog");
const ul = document.querySelector("ul");
const addBtn = document.querySelector("#add_movie");
const form = document.querySelector("form");
const [title, releaseDate, rating, saveBtn, cancelBtn] = [...form];
const para = document.createElement("p");
let titleStr, dateStr, ratingStr;
let isEdit = false;
let editNum;
let isFirst = true;
let leapFlag = true;

const checkEmpty = () => {
  if (localStorage.movieList.length == 2) {
    para.innerText = "-- There is no movie in the list -- ";
    ul.appendChild(para);
  } else {
    para.remove();
  }
};

const updateIndex = () => {
  if (ul.children !== null) {
    Array.from(ul.children).forEach((child, i) => {
      child.setAttribute("data-position", i);
    });
  }
};

const updateArr = (title, releaseDate, rating, position) => {
  let storage = Array.from(
    JSON.parse(window.localStorage.getItem("movieList"))
  );
  storage[position] = [title, releaseDate, rating];
  window.localStorage.setItem("movieList", JSON.stringify(storage));
};

const removeArr = pos => {
  let storage = Array.from(
    JSON.parse(window.localStorage.getItem("movieList"))
  );
  storage.splice(pos, 1);
  window.localStorage.setItem("movieList", JSON.stringify(storage));
};

// create a button given an id and a value
const createBtn = (id, value) => {
  let btn = document.createElement("input");
  btn.type = "button";
  btn.id = id;
  btn.value = value;
  return btn;
};

const addMovie = (title, releaseDate, rating) => {
  let li = document.createElement("li");
  let info = document.createElement("p");
  info.innerText = `${title}(${releaseDate}) - Rated:${rating}`;
  li.appendChild(info);

  let editBtn = createBtn("editBtn", "✎Edit");
  let deleteBtn = createBtn("deleteBtn", "🗑Delete");
  editBtn.addEventListener("click", () => {
    dialog.open = true;
    isEdit = true;
    editNum = editBtn.parentElement.getAttribute("data-position");
  });
  deleteBtn.addEventListener("click", () => {
    li.remove();
    removeArr(li.getAttribute("data-position"));
    updateIndex();
    checkEmpty();
  });
  // add all the buttons and list
  li.setAttribute("data-position", ul.childElementCount);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  if (isEdit) {
    let editBranch = ul.children[editNum];
    ul.children[
      editNum
    ].children[0].innerText = `${title}(${releaseDate}) - Rated:${rating}`;
    updateArr(title, releaseDate, rating, editNum);
    isEdit = false;
  } else {
    ul.appendChild(li);
    if (!isFirst) {
      checkEmpty();
      if (leapFlag) {
        updateArr(
          title,
          releaseDate,
          rating,
          Array.from(JSON.parse(localStorage.movieList)).length
        );
        leapFlag = false;
      } else {
        updateArr(
          title,
          releaseDate,
          rating,
          Array.from(JSON.parse(localStorage.movieList)).length
        );
      }
    }
  }
};
addBtn.addEventListener("click", () => {
  dialog.open = true;
  setTimeout(() => checkEmpty(), 0);
});

saveBtn.addEventListener("click", () => {
  // pass in the values in the form
  titleStr = title.value;
  dateStr = releaseDate.value;
  ratingStr = rating.value;
  setTimeout(() => {
    // reset
    dialog.open = false;
    title.value = "";
    releaseDate.value = "";
    rating.selectedIndex = 0;

    // add movie
    addMovie(titleStr, dateStr, ratingStr);
    checkEmpty();
  });
});

cancelBtn.addEventListener("click", () => {
  setTimeout(() => {
    // reset
    dialog.open = false;
    title.value = "";
    releaseDate.value = "";
    rating.selectedIndex = 0;
    checkEmpty();
  });
});

// populate default array

if (window.localStorage.getItem("movieList") === null) {
  storageList = [
    ["Once Upon a Time in America", 1984, "R"],
    ["The Truman Show", 1998, "PG"],
    ["Cinema Paradiso", 1990, "PG-13"]
  ];
  window.localStorage.setItem("movieList", JSON.stringify(storageList));
} else {
  storageList = Array.from(
    JSON.parse(window.localStorage.getItem("movieList"))
  );
}
storageList.forEach(movieInfo => {
  addMovie(...movieInfo);
});
isFirst = false;
checkEmpty();