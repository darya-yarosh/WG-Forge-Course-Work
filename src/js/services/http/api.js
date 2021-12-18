import {
    tankUrl,
    goldUrl,
    premiumdUrl,
} from '../helper/api.helper';
import { PushToStore } from '../helper/core';
import data from '../helper/database/data';
import router from '../router/router';

const getAllTanks = fetch(tankUrl);
const getAllGolds = fetch(goldUrl);
const getAllPremium = fetch(premiumdUrl);

const getData = () => {
    getAllTanks
        .then((i) => i.json())
        .then((d) => {
            d.forEach((el) => {
                PushToStore(el, data.vehicles);
            });
            data.collect();
            router();
        });

    getAllGolds
        .then((i) => i.json())
        .then((d) => {
            d.forEach((el) => {
                PushToStore(el, data.gold);
            });
            data.collect();
            router();
        });

    getAllPremium
        .then((i) => i.json())
        .then((d) => {
            d.forEach((el) => {
                PushToStore(el, data.premium);
            });
            data.collect();
            router();
        });
};

export default getData;
