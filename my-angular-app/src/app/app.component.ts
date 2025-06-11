import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
})
export class AppComponent implements OnInit {
  weatherData: any;
  activitySuggestion = '';
  loading = true;
  errorMessage = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          this.weatherService
            .getWeatherByCoords(latitude, longitude)
            .subscribe({
              next: (data) => {
                this.weatherData = data.current_weather;
                this.activitySuggestion = this.getSuggestion(
                  data.current_weather
                );
                this.loading = false;
              },
              error: (err) => {
                this.errorMessage = 'Αποτυχία φόρτωσης καιρού.';
                this.loading = false;
              },
            });
        },
        () => {
          this.errorMessage = 'Δεν επιτράπηκε η τοποθεσία.';
          this.loading = false;
        }
      );
    } else {
      this.errorMessage = 'Ο browser δεν υποστηρίζει τοποθεσία.';
      this.loading = false;
    }
  }

  getSuggestion(weather: any): string {
    const temp = weather.temperature;
    const wind = weather.windspeed;

    if (temp > 28) return 'Ζεστή μέρα! Πήγαινε για μπάνιο ή παγωτό στο πάρκο.';
    if (wind > 25) return 'Φυσάει πολύ! Καλή μέρα για αετό ή kite surf.';
    if (temp < 12)
      return 'Κρύο! Ντύσου καλά και πήγαινε για περπάτημα με καφέ.';
    return 'Ιδανική μέρα για βόλτα ή πικ νικ σε εξωτερικό χώρο!';
  }
}
