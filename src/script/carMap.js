export default function carMap(cars, isMyMode) {
  return cars.map(car => `
    <div class="car-card" id="${car.vehicle_id}" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <img src="${car.image_url || 'https://via.placeholder.com/200'}" alt="${car.make || ''} ${car.model || ''}" height="auto" width="200"/>
        <div>
          <h2>${car.color || ''} ${car.make || ''} ${car.model || ''} (${car.year || ''})</h2>
          <h3 style="color: #555;">${car.category_name || ''}</h3>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start; gap: 12px; margin-top: 10px;">
        <div style="width: 60%; border-right: 1px solid #000; padding-right: 10px;">
          <p>${car.engine || ''} | ${car.horsepower || 0} HP,<br>
          0-100kmh in ${car.accel_0_100_sec || 0}s | ${car.top_speed_kmh || 0} kmh (${car.top_speed_mph || 0} mph)</p>
          <p><strong>Status:</strong> ${car.status || 'AVAILABLE'}</p>
          <p><strong>€${car.daily_rate || ''}</strong> | Call: ${car.contact || 'Unlisted number...'} (${car.country || ''})</p>
        </div>

        <div style="width: 40%; overflow-y: scroll;">
          <h6 style="color: #333;">${car.description || 'No Description.'}</h6>
        </div>
      </div>

      ${isMyMode ? `
        <div style="margin-top: 10px; display: flex; gap: 8px;">
          <button type="button" class="toggle-edit-btn">Edit Details</button>
          <button type="button" class="delete-btn" style="color: red;">Delete</button>
        </div>
      ` : ''}

      ${isMyMode ? `
        <form class="editorForm" style="display: none; margin-top: 10px; border-top: 1px dashed #666; padding-top: 10px;">
          <h4>Edit Vehicle Details</h4>
          <label>Status:
            <select name="status">
              <option value="AVAILABLE" ${car.status === 'AVAILABLE' ? 'selected' : ''}>AVAILABLE</option>
              <option value="RENTED" ${car.status === 'RENTED' ? 'selected' : ''}>RENTED</option>
              <option value="MAINTENANCE" ${car.status === 'MAINTENANCE' ? 'selected' : ''}>MAINTENANCE</option>
            </select>
          </label>
          <br>
          <label>Make:
            <input type="text" name="make" value="${car.make || ''}" required>
          </label>
          <br>
          <label>Model:
            <input type="text" name="model" value="${car.model || ''}" required>
          </label>
          <br>
          <label>Year:
            <input type="number" name="year" value="${car.year || ''}" required>
          </label>
          <br>
          <label>Color:
            <input type="text" name="color" value="${car.color || ''}" required>
          </label>
          <br>
          <label>License Plate:
            <input type="text" name="license_plate" value="${car.license_plate || ''}">
          </label>
          <br>
          <label>Category Name:
            <input type="text" name="category_name" value="${car.category_name || ''}">
          </label>
          <br>
          <label>Daily Rate (€):
            <input type="number" name="daily_rate" value="${car.daily_rate || ''}" required>
          </label>
          <br>
          <label>Image URL:
            <input type="text" name="image_url" value="${car.image_url || ''}">
          </label>
          <br>
          <h5>Engine & Performance Specs</h5>
          <label>Engine:
            <input type="text" name="engine" value="${car.engine || ''}">
          </label>
          <br>
          <label>Horsepower:
            <input type="number" name="horsepower" value="${car.horsepower || ''}">
          </label>
          <br>
          <label>0-100 km/h (sec):
            <input type="number" step="0.1" name="accel_0_100_sec" value="${car.accel_0_100_sec || ''}">
          </label>
          <br>
          <label>Top Speed (km/h):
            <input type="number" name="top_speed_kmh" value="${car.top_speed_kmh || ''}">
          </label>
          <br>
          <label>Top Speed (mph):
            <input type="number" name="top_speed_mph" value="${car.top_speed_mph || ''}">
          </label>
          <br>
          <label>Description:
            <textarea name="description">${car.description || ''}</textarea>
          </label>
          <br><br>
          <button type="submit">Save Changes</button><br><br>
          <button type="button" class="cancel-edit-btn">Cancel</button>
        </form>
      ` : ''}
    </div>
  `).join("");
}
