// modified when edit and delete
var currEditIndex = null;
var currDeleteIndex = null;
var accessToken = JSON.parse(localStorage.ID_JSON).id;

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
  let currChild = ul_el.children[currDeleteIndex];
  let remoteId = currChild.getAttribute("data-remoteId");
  currChild.remove();
  remoteDeleteItemById(remoteId);
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
            XHR remote methods
-------------------------------------------------------*/
/**
 * get all elements in the wishList of the current user
 * This has some problem with call backs and all. Watch out for that
 * @returns the wishItems
 */
const remoteGetAll = listObj => {
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      console.log(this.responseText);
      listObj = JSON.parse(this.responseText);
    }
  });

  xhr.open(
    "GET",
    `http://fa19server.appspot.com/api/wishlists/myWishlist?access_token=${accessToken}`,
    true
  );
  xhr.setRequestHeader("Accept", "*/*");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.send(data);
};

/**
 *
 * @param {JSON} payload the payload that want to add to database
 */
const remoteAdd = payload => {
  let data = `item=${payload.item}&price=${payload.price}&category=${payload.categoty}&image=${payload.image}&comment=${payload.comment}`;

  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  xhr.open(
    "POST",
    "http://fa19server.appspot.com/api/wishlists?access_token=v7DYO9Ll3HXVCkMZ8M4dUzIc8SUBgkhDGPlyNLXaB6cWtWWY3CztTzVsoLbBNXT6"
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.send(data);
};

/**
 * This method print the remoteElement you want to get by id
 * @param {String} remoteId Element that you want to get
 */
const remoteGetItemById = remoteId => {
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  xhr.open(
    "GET",
    `http://fa19server.appspot.com/api/wishlists/${remoteId}?access_token=${accessToken}`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Cache-Control", "no-cache");

  xhr.send(data);
};

/**
 * Delete the item by id
 * @param {string} remoteId
 */
const remoteDeleteItemById = remoteId => {
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  xhr.open(
    "DELETE",
    `http://fa19server.appspot.com/api/wishlists/${remoteId}?access_token=${accessToken}`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Cache-Control", "no-cache");

  xhr.send(data);
};

/**
 * Update the item by id
 * @param {string} remoteId
 */
const remoteUpdateItemById = (remoteId, payload) => {
  let data = `item=${payload.item}&price=${payload.price}&category=${payload.category}&image=${payload.image}&comment=${payload.comment}`;

  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  xhr.open(
    "POST",
    `http://fa19server.appspot.com/api/wishlists/${remoteId}/replace?access_token=${accessToken}`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Cache-Control", "no-cache");

  xhr.send(data);
};

/**
 * logout the current user
 */
const remoteLogout = () => {
  let xhr = new XMLHttpRequest();
  let data = null;
  xhr.open(
    "POST",
    `http://fa19server.appspot.com/api/Users/logout?${accessToken}`,
    true
  );

  xhr.onreadystatechange = () => {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      console.log(`User ${accessToken} is logged out`);
    }
  };

  xhr.send(data);
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
 * logout user from local storage
 */
const localLogout = () => {
  localStorage.clear();
};

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
  let image_url = "./tenor.gif";

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

  const ul_el = document.querySelector("ul");
  // display first
  if (index !== null) {
    // edit current element
    let oldChild = ul_el.children[index];
    let remoteId = oldChild.getAttribute("data-remoteId");

    // update Li
    currLi.setAttribute("data-remoteId", remoteId);
    oldChild.replaceWith(currLi);
    currEditIndex = null;
  } else {
    ul_el.appendChild(currLi);
    let elem_payload = gift;
  }

  // Then take care about the image
  var file = image_el.files[0];

  // upload picture and get URL
  let xhr = new XMLHttpRequest();
  let endPoint = "https://api.cloudinary.com/v1_1/dq4d7oo7k/image/upload";
  xhr.open("post", endPoint);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      image_url = response.secure_url;

      // update localStorage
      addStorageElem(index, gift);

      // append depending on whether it is edit or normal addition
      if (index !== null) {
        // update the image here
        const img_target = ul_el.children[index].querySelector("img");
        img_target.src = image_url;

        // edit current element
        let oldChild = ul_el.children[index];
        let remoteId = oldChild.getAttribute("data-remoteId");

        // remoteUpdateItemById(remoteId, payload)
        let elem_payload = gift;
        let data = `item=${elem_payload.item}&price=${elem_payload.price}&category=${elem_payload.category}&image=${elem_payload.image}&comment=${elem_payload.comment}`;

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
          if (this.readyState === 4) {
            console.log(this.responseText);
          }
        });

        xhr.open(
          "POST",
          `http://fa19server.appspot.com/api/wishlists/${remoteId}/replace?access_token=${accessToken}`
        );
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);

        // update Li
        currEditIndex = null;
      } else {
        const img_target = ul_el.lastChild.querySelector("img");
        img_target.src = image_url;

        ul_el.appendChild(currLi);
        let elem_payload = gift;
        // add new element to database
        let data = `item=${elem_payload.item}&price=${elem_payload.price}&category=${elem_payload.category}&image=${elem_payload.image}&comment=${elem_payload.comment}`;

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
          if (this.readyState === 4) {
            console.log(this.responseText);
            let remoteId = JSON.parse(this.responseText).id;
            currLi.setAttribute("data-remoteId", remoteId);
          }
        });

        xhr.open(
          "POST",
          "http://fa19server.appspot.com/api/wishlists?access_token=v7DYO9Ll3HXVCkMZ8M4dUzIc8SUBgkhDGPlyNLXaB6cWtWWY3CztTzVsoLbBNXT6"
        );
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );

        xhr.send(data);
      }
    }
  };
  // send the image data
  let payload = new FormData();
  payload.append("upload_preset", "ml_default");
  payload.append("file", file);
  xhr.send(payload);
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

  currDeleteindex = null;
  document.querySelector("#deleteDialog").open = false;
});

// event listenr of cancel button in delete
const deleteCancelBtn = document.querySelector("#deleteCancel");
deleteCancelBtn.addEventListener("click", () => {
  currDeleteindex = null;
  document.querySelector("#deleteDialog").open = false;
});

// event listener for addBtn
const addBtn = document.querySelector("#addBtn");
addBtn.addEventListener("click", () => {
  document.querySelector("#createDialog").open = true;
});

const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", () => {
  remoteLogout();
  localLogout();
});
