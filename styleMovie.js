const deleteDialog = document.querySelector("#deleteDialog");
const ul = document.querySelector("ul");
const addBtn = document.querySelector("#add_movie");
const form = document.querySelector("form");

const dialog = document.querySelector("#editMovie");
const [title_elem, releaseDate_elem, rating_elem, saveBtn, cancelBtn] = [
  ...form
];

// global var to set which element should be deleted
let currDeleteLi = null;

const para = document.createElement("p");
let titleStr, dateStr, ratingStr;
let isEdit = false;
let editNum;
let isFirst = true;
let leapFlag = true;

// check if the local storage is empty. If so, display the string
// saying that there is nothing in the list
const checkEmpty = () => {
  const noMoviePrompt = document.querySelector("#noMoviePrompt");
  if (localStorage.movieList.length == 2) {
    para.innerText = "-- There is no movie in the list -- ";
    noMoviePrompt.appendChild(para);
  } else {
    para.remove();
  }
};

// after deletion, update the index
const updateIndex = () => {
  if (ul.children !== null) {
    Array.from(ul.children).forEach((child, i) => {
      child.setAttribute("data-position", i);
    });
  }
};

// update the localStorage
const updateArr = (title, releaseDate, rating, position) => {
  let storage = Array.from(
    JSON.parse(window.localStorage.getItem("movieList"))
  );
  storage[position] = [title, releaseDate, rating];
  window.localStorage.setItem("movieList", JSON.stringify(storage));
};

// remove an element from local Storage Arr, but does not modify local copy
const removeArr = pos => {
  let storage = Array.from(
    JSON.parse(window.localStorage.getItem("movieList"))
  );
  storage.splice(pos, 1);
  window.localStorage.setItem("movieList", JSON.stringify(storage));
};

const deleteLi = li => {
  li.remove();
  removeArr(li.getAttribute("data-position"));
  updateIndex();
  checkEmpty();
};

// create a button given an id and a value
const createBtn = (id, value) => {
  let btn = document.createElement("input");
  btn.type = "button";
  btn.id = id;
  btn.value = value;
  return btn;
};

const getStorageArr = () => {
  return JSON.parse(localStorage.movieList);
};

// add a movie
const addMovie = (title, releaseDate, rating) => {
  let li = document.createElement("li");
  let info = document.createElement("p");
  info.innerText = `${title}(${releaseDate}) - Rated:${rating}`;
  li.appendChild(info);

  // attach the buttons
  let editBtn = createBtn("editBtn", "✎Edit");
  let deleteBtn = createBtn("deleteBtn", "🗑Delete");
  editBtn.addEventListener("click", () => {
    dialog.open = true;
    isEdit = true;
    editNum = editBtn.parentElement.getAttribute("data-position");

    let storageArr = getStorageArr();
    const TITLE_POS = 0;
    const YEAR_POS = 1;
    const RATING_POS = 2;

    // when edit, previous values should be there
    let currElem = storageArr[editNum];
    title_elem.value = currElem[TITLE_POS]; // hey you can just access attribute by elem.attribute = value
    releaseDate_elem.value = currElem[YEAR_POS];
    // make the optionElem select on what the user used to select
    let optionElem = document.querySelector(
      `option[value=${currElem[RATING_POS]}]`
    );
    optionElem.selected = true;
  });

  deleteBtn.addEventListener("click", e => {
    currDeleteLi = e.srcElement.parentElement;
    deleteDialog.open = true;
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

// add event Listener for edit/add dialog
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

// add event listener for btns in deleteDialog
const deleteBtn_DDia = document.querySelector("#deleteBtn_DDia"); // DDia -- Delete Dialog
const deleteCancelBtn_DDia = document.querySelector("#cancelBtn_DDia");

deleteBtn_DDia.addEventListener("click", () => {
  deleteLi(currDeleteLi);

  // reset
  currDeleteLi = null;
  deleteDialog.open = false;
});

deleteCancelBtn_DDia.addEventListener("click", () => {
  deleteDialog.open = false;
})

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
