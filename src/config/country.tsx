
import countryList from '../../public/country.json'
  
export const country = countryList
export const getCountryName = (slug: string) => {
    return country.find(e => e.name === slug)?.name
}

export const getStateName = (slugC: string, slugS: string) => {
    return country.find(e => e.name === slugC)?.states.find(e => e.name === slugS)?.name
}