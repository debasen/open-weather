export class AppWeatherModel {
    main: {
        feels_like: number,
        humidity: number,
        pressure: number,
        temp: number,
        temp_max: number,
        temp_min: number
    };
    weather: [{
        id: number,
        main: string,
        description: string,
        icon: string
    }];
    wind: {
        speed: number
    }
    constructor() {
        this.main = {
            feels_like: 0,
            humidity: 0,
            pressure: 0,
            temp: 0,
            temp_max: 0,
            temp_min: 0
        };
        this.weather = [{ id: 0, main: '', description: '', icon: '' }];
    }
}