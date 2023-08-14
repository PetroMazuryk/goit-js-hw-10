import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const text = e.target.value.trim();

  if (!text) {
    renderClear(refs.countryList);
    renderClear(refs.countryInfo);
    return;
  }

  fetchCountries(text)
    .then(r => {
      if (r.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        renderClear(refs.countryList);
        renderClear(refs.countryInfo);
        return;
      }

      if (r.length >= 2 && r.length <= 10) {
        renderClear(refs.countryInfo);

        const filterCountries = r.map(country =>
          filterCountriesOptions(country)
        );
        renderCountriesList(filterCountries);

        return;
      }
      if ((r.length = 1)) {
        renderClear(refs.countryList);

        const filterCountries = r.map(country =>
          filterCountriesOptions(country)
        );
        renderCountriesCard(filterCountries);
        console.log(filterCountries);

        return;
      }
    })
    .catch(error => console.log(error));
}

function filterCountriesOptions({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  return {
    nameOficial: name.official,
    capital,
    population,
    flags: flags.svg,
    languages: Object.values(languages),
  };
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ flags, nameOficial }) => {
      return `<li class="country-item">
        <p class="country-item__text">
          <img src="${flags}" alt="is ${nameOficial} flag" width="24" />
        ${nameOficial}
        </p>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountriesCard(countries) {
  const markup = countries
    .map(({ flags, nameOficial, population, languages, capital }) => {
      return `
        <p class="country-item__title">
          <img src="${flags}" alt="is ${nameOficial} flag" width="24" />
        ${nameOficial}
        </p>
        <p class="country-item__text">Capital: ${capital}</p>
<p class="country-item__text">Population: ${population}</p>
<p class="country-item__text">Languages: ${languages}</p>
      `;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function renderClear(element) {
  const markup = ``;
  element.innerHTML = markup;
}
