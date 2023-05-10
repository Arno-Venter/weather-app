const findState = () => {
  const success = (position) => {
    console.log(position.coords.longitude);
  };

  const error = (position) => {
    console.log(position.coords.longitude);
  };

  navigator.geolocation.getCurrentPosition(success, error);
};

findState();
