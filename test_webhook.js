const url = 'https://script.google.com/macros/s/AKfycbx7zcxPNbTCEvdtmHOKBN-Q-GDFJanlgC6cAP4-6qhwIvJUT-mgg8GzLxdLpk14wFe1/exec';

const formData = new URLSearchParams();
formData.append('firstName', 'Test');
formData.append('lastName', 'User');
formData.append('phone', '0501234567');
formData.append('email', 'test@test.com');

fetch(url, {
  method: 'POST',
  body: formData
})
.then(res => res.text())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
