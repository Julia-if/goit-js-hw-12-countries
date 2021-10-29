import '../sass/main.scss';
import { error } from '@pnotify/core'
import { defaults } from '@pnotify/core'
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import refs from './refs.js'
import fetchCountries from './fetchCountries.js'

import countriesListTpl from '../templates/list.hbs'
import countryCardTpl from '../templates/card.hbs'

import debounce from 'lodash.debounce'

// change default delay of the error notice
defaults.delay = 3000;

refs.input.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(e) {
    const inputValue = e.target.value.trim();
    if (inputValue === "") {
        clearContent();
        return
    };

    fetchCountries(inputValue)
        .then(countries => {
        if (countries.status === 404) {
            onError();
        };

        if (countries.length === 1) {
            renderMarkup(...countries, countryCardTpl);
            return
        };

        if (countries.length >= 2 && countries.length <= 10) {
            renderMarkup(countries, countriesListTpl);
            return
        };

        if (countries.length > 10) {
            const message = "Too many matches found. Please enter a more specific query!";
            showNotification(message);
            clearContent();
        };
        })
        .catch((error) => {
            console.log(error)
            onError();
        })
};

function showNotification(message) {
    error({
        text: `${message}`,
    });
};

function renderMarkup(countries, template) {
    const markup = template(countries);
    refs.content.innerHTML = markup;
};

function clearContent() {
    refs.content.innerHTML = "";
};

function onError() {
    const message = 'There is no such country!';
            showNotification(message);
            clearContent();
}
