// modified when edit and delete
var currEditIndex = null;
var currDeleteIndex = null;

/* --------------------------------------------------
            Element Modification Functions
----------------------------------------------------*/

// parent -- parent element (li) of a edit button
const createEditBtn = li => {
  const editBtn_el = document.createElement("input");
  editBtn_el.value = "Edit";
  editBtn_el.type = "button";
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
  // TODO remove remote
};

/**
 *
 * Creates a delete button element inside of li
 * @param {HTMLElement} li parent li element that the delete button adds to
 * @return {HTMLElement} the delete button element
 */
const createDeleteBtn = li => {
  const deleteBtn_el = document.createElement("input");
  deleteBtn_el.type = "button";
  deleteBtn_el.value = "Delete";
  deleteBtn_el.addEventListener("click", () => {
    currDeleteIndex = whichChild(li);
    const deleteDialog_el = document.querySelector("#deleteDialog");
    deleteDialog_el.open = true;
  });
  return deleteBtn_el;
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
  image_el.setAttribute("height", "200px");
  image_el.setAttribute("width", "200px");

  const comment_el = document.createElement("p");
  comment_el.class = "comment";
  comment_el.innerHTML = comment;

  const editBtn_el = createEditBtn(li_elem);
  const deleteBtn_el = createDeleteBtn(li_elem);

  // put everything inside of the list
  li_elem.appendChild(item_elem);
  li_elem.appendChild(price_el);
  li_elem.appendChild(category_el);
  li_elem.appendChild(image_el);
  li_elem.appendChild(comment_el);
  li_elem.appendChild(editBtn_el);
  li_elem.appendChild(deleteBtn_el);

  return li_elem;
};

/*------------------------------------------------------
            XHR remove methods
-------------------------------------------------------*/

/**
 *
 * Create a new
 * @param {JSON} payload payload sent to database
 */
const remoteCreate = payload => {
  const xhr = new XMLHttpRequest();
  let endPoint = "http://fa19server.appspot.com/api/wishlists/myWishlist?access_token=";
  const accessToken = JSON.parse(localStorage.ID_JSON).id;
  endPoint = endPoint + accessToken;

  xhr.open("POST", endPoint, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      console.log(JSON.parse(xhr.response));
    }
  };
  xhr.send(JSON.stringify(payload));
};

/* -----------------------------------------
                Helper method
    --------------------------------------------*/

// citation -- https://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript/20285053#20285053
// it takes a file that is uploaded from local, and return the encoded image
/**
 * This function takes an encoded image and return a encoded base64 data url
 * @param {HTMLElement} element image element
 * @return image in encoded base64
 */
function encodeImageFileAsURL(element) {}

/**
 * This function remove an element in local storage at given index
 * @param {ind} index at which the local storage elem should be removed
 */
const removeStorageElem = index => {
  const giftList = JSON.parse(window.localStorage.getItem("giftList"));
  giftList.splice(index, 1);
  localStorage.setItem("giftList", JSON.stringify(giftList));
};

/**
 *
 * @param {int} index where you want to add the elem
 * @param {JSON} obj the object to be added
 */
const addStorageElem = (index, obj) => {
  let giftList = JSON.parse(localStorage.getItem("giftList"));

  // if index = null, initialize the array
  if (giftList === null) {
    giftList = [obj];
  } else if (index === null) {
    // if index is null, append
    giftList.push(obj);
  } else {
    // else, modify it before we go
    giftList[index] = obj;
  }
  localStorage.setItem("giftList", JSON.stringify(giftList));
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
  return i - 1;
}

/**
 * This function upload an image to cloudinary and then return the url
 * @param {*} file
 * @return a url returned from Cloudinar service
 */
const uploadCloudinary = file => {
  const xhr = new XMLHttpRequest();
  const endPoint = "https://api.cloudinary.com/v1_1/dq4d7oo7k/image/upload";
  xhr.open("post", endPoint);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      return response["secure_url"];
    }
  };
  const payload = new FormData();
  payload.append("upload_preset", "ml_default");
  payload.append("file", file);
  xhr.send(payload);
};

/**
 * Get info from createDialog, parse them, create an li, then append it to ul, also update localStorage
 * But the image have to be loaded first, then other action ensue
 * @param {int} index where you want the new Li to be added ni the ul
 */
const addGift = index => {
  const item_el = document.querySelector("#item");
  const price_el = document.querySelector("#price");
  const category_el = document.querySelector("#category");
  const comment_el = document.querySelector("#comment");
  const image_el = document.querySelector("#image");
  let image_url = null;

  // read the image and load it
  var file = image_el.files[0];
  //image_url = uploadCloudinary(file);

  // upload picture to
  const xhr = new XMLHttpRequest();
  const endPoint = "https://api.cloudinary.com/v1_1/dq4d7oo7k/image/upload";
  xhr.open("post", endPoint);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      image_url = response.secure_url;

      // don't do anything before the image is loaded
      console.log("url is " + image_url);
      const currLi = createLi(
        item_el.value,
        price_el.value,
        category_el.value,
        image_url,
        comment_el.value
      );

      const gift = {
        item: item_el.value,
        price: price_el.value,
        category: category_el.value,
        image: image_url,
        comment: comment_el.value
      };

      // update localStorage
      addStorageElem(index, gift);

      // append depending on whether it is edit or normal addition
      const ul_el = document.querySelector("ul");
      if (index !== null) {
        ul_el.children[index].replaceWith(currLi);
        currEditIndex = null;
      } else {
        ul_el.append(currLi);
        remoteCreate(gift);
      }
    }
  };
  const payload = new FormData();
  payload.append("upload_preset", "ml_default");
  payload.append("file", file);
  xhr.send(payload);

  //   const payload = new FormData();
  //   payload.append("upload_preset", "ml_default");
  //   payload.append("file", file);
  //   xhr.send(payload);

  //   // don't do anything before the image is loaded
  //   console.log("url is " + image_url);
  //   const currLi = createLi(
  //     item_el.value,
  //     price_el.value,
  //     category_el.value,
  //     image_url,
  //     comment_el.value
  //   );

  //   const gift = {
  //     item: item_el.value,
  //     price: price_el.value,
  //     category: category_el.value,
  //     image: image_url,
  //     comment: comment_el.value
  //   };

  //   // update localStorage
  //   addStorageElem(index, gift);

  //   // append depending on whether it is edit or normal addition
  //   const ul_el = document.querySelector("ul");
  //   if (index !== null) {
  //     ul_el.children[index].replaceWith(currLi);
  //     currEditIndex = null;
  //   } else {
  //     ul_el.append(currLi);
  //   }
};

/**
 * convert localStorage to li
 */
const storage2Li = () => {};

/* ------------------------------------------
                Add EventListener
    ----------------------------------------*/

// set the confirm button in create dialog
const createConfirm_el = document.querySelector("#editConfirm");
createConfirm_el.addEventListener("click", () => {
  // added to HTML
  addGift(currEditIndex);

  // added to local storage
  document.querySelector("#createDialog").open = false;
});

// set the cancel button in create dialog
const createCancel_el = document.querySelector("#editCancel");
createCancel_el.addEventListener("click", () => {
  document.querySelector("#createDialog").open = false;
  currEditIndex = null;
});

// event listener in the delete button in delete dialog
const deleteOKBtn = document.querySelector("#deleteOK");
deleteOKBtn.addEventListener("click", () => {
  deleteLi();
  removeStorageElem(currDeleteIndex);

  // TODO DEBUG set delete remove database

  currdeleteindex = null;
  document.querySelector("#deleteDialog").open = false;
});

// event listenr of cancel button in delete
const deleteCancelBtn = document.querySelector("#deleteCancel");
deleteCancelBtn.addEventListener("click", () => {
  currdeleteindex = null;
  document.querySelector("#deleteDialog").open = false;
});

// event listener for addBtn
const addBtn = document.querySelector("#addBtn");
addBtn.addEventListener("click", () => {
  document.querySelector("#createDialog").open = true;
});
