// eslint-disable-next-line import/no-cycle
import { calcExchangeRate } from '../exchangeRate';
// eslint-disable-next-line import/no-cycle
import components from '../router/components';
import {
    coverPlace,
    shoppingCart,
    shoppingCartItems,
    payBlock,
    test,
    countOfShoppingCart,
    summShoppingList,
    summPayPage,
} from './constants';
import data from './database/data';

const getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value);

const changeCountOfWishItems = (arrayOfWishItems, countValueOnPage) => {
    // eslint-disable-next-line no-param-reassign
    countValueOnPage.textContent = `(${arrayOfWishItems.length})`;
};
const addToLocalStorage = (id, item) => {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem(`${user.username}-cart-${id}`, JSON.stringify(item));
};

const parseLSItem = (item) => JSON.parse(localStorage.getItem(item));

const deleteFromLocalStorage = (item) => {
    localStorage.removeItem(item);
};

const addNotifyBlock = (target) => {
    const errMessage = document.createElement('div');
    errMessage.className = 'auth-notify';
    const notificationBlock = document.querySelector('main nav');
    errMessage.innerText = 'Вы не залогинены';
    notificationBlock.insertAdjacentElement('afterend', errMessage);
    let et;
    if (target) {
        et = target;
        et.checked = false;
        et.disabled = true;
    }
    setTimeout(() => {
        errMessage.remove();
        if (target) {
            et.disabled = false;
        }
    }, 1000);
};

const getItems = () => {
    const keys = Object.keys(localStorage);
    const wishlist = [];
    keys.forEach((key) => {
        if (key.startsWith(`${parseLSItem('user').username}-cart-`)) {
            wishlist.push(JSON.parse(localStorage.getItem(key)));
        }
    });
    return wishlist;
};

const PushToStore = (item, base) => {
    // eslint-disable-next-line no-param-reassign
    item.check = false;
    if (localStorage.getItem(item.id)) {
        // eslint-disable-next-line no-param-reassign
        item.check = true;
        base.push(item);
    } else base.push(item);
};

// get item from all atmems by id

const getItemById = (id) => {
    const target = data.all.find((tank) => tank.uuid === id);
    return target;
};

// get all items from local storage

const getAllShoppingListItems = () => JSON.parse(localStorage.getItem('userCart'));

// add shopping list items to local storage

const addShoppingListItems = (items) => localStorage.setItem('userCart', JSON.stringify(items));

// change data in shopping list item

const changeDataShoppingList = (id, targetValue, value) => {
    const allItems = getAllShoppingListItems();
    if (allItems) {
        const index = allItems.findIndex((i) => i.uuid === id);
        allItems[index].count = value;
        addShoppingListItems(allItems);
    }
};

// Check and update start state of shipping cart count

const checkShippingCartCount = () => {
    if (localStorage.getItem('userCart')) {
        countOfShoppingCart.textContent = `(${(JSON.parse(localStorage.getItem('userCart'))).length})`;
    } else {
        countOfShoppingCart.textContent = '(0)';
    }
};

// calc cost shopping cart items

const getCostShoppingCartItems = () => {
    const items = JSON.parse(localStorage.getItem('userCart'));
    let result = 0;
    if (items) {
        // eslint-disable-next-line no-return-assign
        items.forEach((item) => result += item.price * item.count);
    }
    return result;
};

// calc cost shopping cart item by id

const getCostShoppingCartOneItem = (uuid) => {
    const items = JSON.parse(localStorage.getItem('userCart'));
    let result = 0;
    let cost;
    let count;
    if (items) {
        const index = items.findIndex((i) => i.uuid === uuid);
        count = items[index].count;
        cost = items[index].price;
        result = count * cost;
    }
    return result;
};

// convert Currency for Shopping list

const convertSummToCorrectCurrency = () => {
    const summ = getCostShoppingCartItems();
    const summWithCurrency = calcExchangeRate(summ);
    return summWithCurrency;
};

// convert Currency for Shopping Item

const convertCostToCorrectCurrency = (uuid) => {
    const cost = getCostShoppingCartOneItem(uuid);
    const CostWithCurrency = calcExchangeRate(cost);
    return CostWithCurrency;
};

// Open/close Shopping cart

const openShoppingCart = () => {
    coverPlace.classList.remove('hidden');
    document.body.classList.add('notScroll');
    shoppingCart.classList.remove('hidden');
    summShoppingList.textContent = convertSummToCorrectCurrency();
    if (localStorage.getItem('userCart')) {
        test.innerHTML = components.ShoppingCart.render(JSON.parse(localStorage.getItem('userCart')));
    }
};

const backToShoppingCart = () => {
    payBlock.classList.add('hidden');
    shoppingCartItems.classList.remove('hidden');
};

// delete item from shopping list

const deleteItemFromShoppingList = (id) => {
    const listOfShoppingListItems = JSON.parse(localStorage.getItem('userCart'));
    // eslint-disable-next-line max-len
    const updatelistOfShoppingListItems = listOfShoppingListItems.filter((item) => item.uuid !== id);
    localStorage.setItem('userCart', JSON.stringify(updatelistOfShoppingListItems));
    summShoppingList.textContent = convertSummToCorrectCurrency();
    return updatelistOfShoppingListItems;
};

const closeShoppingCart = () => {
    coverPlace.classList.add('hidden');
    document.body.classList.remove('notScroll');
    shoppingCart.classList.add('hidden');
};

const closeShoppingCartAndPay = () => {
    coverPlace.classList.add('hidden');
    document.body.classList.remove('notScroll');
    shoppingCart.classList.add('hidden');
    shoppingCartItems.classList.remove('hidden');
    payBlock.classList.add('hidden');
};

// close cart and open pay

const openPay = () => {
    shoppingCartItems.classList.add('hidden');
    payBlock.classList.remove('hidden');
    summPayPage.textContent = convertSummToCorrectCurrency();
};

// check contains item on shopping list

const checkItemContainsShoppingList = (uuid) => {
    const allItems = getAllShoppingListItems();
    const item = allItems.find((i) => i.uuid === uuid);
    if (item !== undefined) {
        return true;
    }
    return false;
};

// shipping cart Handler

function shippingCartHandler(e) {
    if (e.target.classList.contains('deleteItemCart')) {
        const { item } = e.target.dataset;
        const newShoppingList = deleteItemFromShoppingList(item);
        test.innerHTML = components.ShoppingCart.render(newShoppingList);
        checkShippingCartCount();
    } else if (e.target.classList.contains('plus')) {
        const oldValue = Number(e.target.previousElementSibling.innerText);
        const { uuid } = e.target.dataset;
        changeDataShoppingList(uuid, 'count', oldValue + 1);
        document.getElementById(`count-${uuid}`).innerText = String(oldValue + 1);
        summShoppingList.textContent = convertSummToCorrectCurrency();
        document.getElementById(`sum-${uuid}`).innerText = convertCostToCorrectCurrency(uuid);
    } else if (e.target.classList.contains('minus')) {
        const oldValue = e.target.nextElementSibling.innerText;
        const { uuid } = e.target.dataset;
        if (oldValue > 1) {
            changeDataShoppingList(uuid, 'count', oldValue - 1);
            document.getElementById(`count-${uuid}`).innerText = String(oldValue - 1);
            summShoppingList.textContent = convertSummToCorrectCurrency();
            document.getElementById(`sum-${uuid}`).innerText = convertCostToCorrectCurrency(uuid);
        }
    }
}

export {
    checkShippingCartCount,
    getKeyByValue,
    changeCountOfWishItems,
    addToLocalStorage,
    deleteFromLocalStorage,
    getItems,
    PushToStore,
    parseLSItem,
    addNotifyBlock,
    openShoppingCart,
    closeShoppingCart,
    openPay,
    closeShoppingCartAndPay,
    shippingCartHandler,
    getItemById,
    checkItemContainsShoppingList,
    backToShoppingCart,
};
