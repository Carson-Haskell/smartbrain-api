const API_ENDPOINT =
  'https://api.clarifai.com/v2/models/face-detection/outputs';

const getRequestOptions = (imageUrl) => {
  const PAT = '1ba2de1f3a26480788a152c5e37fa183';
  const USER_ID = 'carsonhas';
  const APP_ID = 'smartbrain';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

const imageApiRoute = (req, res) => {
  const { input } = req.body;

  fetch(API_ENDPOINT, getRequestOptions(input))
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json('Unable to work with API'));
};

const imageRoute = (db) => (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json('Unable to get entries'));
};

export default {
  imageRoute,
  imageApiRoute,
};
