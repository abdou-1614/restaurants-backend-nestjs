import { Location } from "src/restaurant/schema/location.schema"

const NodeGeoCoder = require('node-geocoder')

export class ApiFeatures {
    static async getRestaurantLocation(address: any) {
        try{
            const options = {
                provider: process.env.GEOCODER_PROVIDER,
                httpAdapter: 'https',
                apiKey: process.env.GEOCODER_API_KEY,
                formatter: null
            }
            const geoCoder = NodeGeoCoder(options)
            const loc = await geoCoder.geocode(address)
            const location: Location = {
                type: 'Point',
                coordinates: [loc[0].longitude, loc[0].latitude],
                formattedAddress: loc[0].formattedAddress,
                city: loc[0].city,
                state: loc[0].state,
                zipcode: loc[0].zipcode,
                country: loc[0].countryCode
            }
            return location
        }catch(e) {
            throw new Error(e);
        }
    }
}