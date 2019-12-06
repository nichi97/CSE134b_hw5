// modified when edit and delete
let currEditIndex = null;
let currDeleteIndex = null;

/* --------------------------------------------------
            Element Modification Functions
----------------------------------------------------*/

// parent -- parent element (li) of a edit button
const createEditBtn = li => {
  const editBtn_el = document.createElement("button");
  editBtn_el.value = "Edit";
  editBtn_el.addEventListener("click", () => {
    // keep track of which one we are editing here
    currEditIndex = whichChild(li);

    const dialog_el = document.querySelector("#createDialog");
    //upon click, open the dialog box
    dialog_el.open = true;
  });
  return editBtn_el;
};

/**
 * delete the li element that at currDeleteIndex
 */
const deleteLi = () => {
  const ul_el = document.querySelector("ul");
  // remove local storage
  ul_el.children[currDeleteIndex].remove();
};

/**
 *
 * Creates a delete button element inside of li
 * @param {HTMLElement} li parent li element that the delete button adds to
 * @return {HTMLElement} the delete button element
 */
const createDeleteBtn = li => {
  const deleteBtn_el = document.createElement("button");
  deleteBtn_el.value = "Delete";
  deleteBtn_el.addEventListener("click", () => {
    currDeleteIndex = whichChild(li);
  });
  const deleteDialog_el = document.querySelector("#deleteDialog");
  deleteDialog_el.open = true;
};

// item -- string
// price -- string
// category -- string
// image -- image in encoded 64 base
// comment -- comment that user want to add

// return the li element that has been created
const createLi = (item, price, category, image, comment) => {
  const li_elem = document.createElement("li");

  const item_elem = document.createElement("p");
  item_elem.class = "item";
  item_elem.innerHTML = item;

  const price_el = document.createElement("p");
  price_el.class = "price";
  price_el.innerHTML = price;

  const category_el = document.createElement("p");
  category_el.class = "category";
  category_el.innerHTML = category;

  // still need to think about this one
  const image_el = document.createElement("img");
  image_el.src = image;

  const comment_el = document.createElement("p");
  comment_el.class = "comment";
  comment_el.innerHTML = comment;

  const editBtn_el = createEditBtn(li_elem);

  // put everything inside of the list
  li_elem.appendChild(item_elem);
  li_elem.appendChild(price_el);
  li_elem.appendChild(category_el);
  li_elem.appendChild(image_el);
  li_elem.appendChild(comment_el);
  li_elem.appendChild(editBtn_el);

  return li_elem;
};

/* -----------------------------------------
                Helper method
    --------------------------------------------*/

// citation -- https://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript/20285053#20285053
// it takes a file that is uploaded from local, and return the encoded image
/**
 *
 * This function takes an encoded image and return a encoded base64 data url
 * @param {HTMLElement} element image element
 * @return image in encoded base64
 */
function encodeImageFileAsURL(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    console.log("RESULT", reader.result);
    return reader.result;
  };
  reader.readAsDataURL(file);
}

/**
 * This function remove an element in local storage at given index
 * @param {ind} index at which the local storage elem should be removed
 *
 */
const removeStorageElem = index => {
  const giftList = JSON.parse(window.localStorage.getItem("giftList"));
  giftList.splice(index, 1);
  localStorage.setItem("giftList", giftList);
};

// citation -- https://stackoverflow.com/a/5913984
/**
 * Return position of a child in its parent
 * @param {HTMLElement} child child whose order is being queried
 * @returns position of the child in parent element
 */
function whichChild(child) {
  let i = 0;
  while ((child = child.previousSibling) != null) {
    i++;
  }
  return i;
}

/* ---------------------------------------
                Add EventListener
    ----------------------------------------*/
const createConfirm_el = document.querySelector("#editConfirm");
createConfirm_el.addEventListener("click", () => {
  const item_el = document.querySelector("#item");
  const price_el = document.querySelector("#price");
  const category_el = document.querySelector("#category");
  const image_el = document.querySelector("#image");
  const comment = document.querySelector("#comment");

  const currLi = createLi(
    item_el.innertext,
    price_el.innertext,
    category_el.innertext,
    encodeImageFileasURL(image_el),
    comment_el.innertext
  );
  const ul_el = document.querySelector("ul");
  ul_el.children[currEditIndex] = currLi;
  // TODO haven't done yet
});

// event listener in the delete button in delete dialog
const deleteOKBtn = document.querySelector("deleteOK");
deleteOKBtn.addEventListener("click", () => {
  deleteLi();
  removeStorageElem(currDeleteIndex);

  // TODO DEBUG set delete remove database

  currdeleteindex = null;
  document.queryselector("#deletedialog").open = false;
});

// event listenr of cancel button in delete
const deleteCancelBtn = document.querySelector("#deleteCancel");
deleteCancelBtn.addEventListener("click", () => {
  currdeleteindex = null;
  document.queryselector("#deletedialog").open = false;
});

