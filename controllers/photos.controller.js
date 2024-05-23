const Photo = require('../models/photo.model');
const checkHtml = require('../utilis/checkHtml');
const Voter = require('../models/Voter.model');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;


    if(title && author && email && file && checkHtml(title) && checkHtml(author) && checkHtml(email)) { // if fields are not empty...

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg

      const fileExt = fileName.split('.').slice(-1)[0]; // cut only file extension e.g abc.jpg -> jpg

      if( fileExt === 'jpg' || fileExt == 'git' || fileExt === 'png'){

        const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
        await newPhoto.save(); // ...save new photo in DB
        res.json(newPhoto);
      } else {
        throw new Error('Wrong input!');
      }
  
    } else {
      throw new Error('Wrong input!');
    }

  } catch(err) {
    res.status(500).json(err);
  }

};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch(err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {

  try {

    const voteClient = await Voter.findOne( { user: req.clientIp});
    if (!voteClient){
      const addClient = await Voter.create({ user: req.clientIp, votes: [req.params.id]});
      addClient.save();
    } else {
      const index = voteClient.votes.indexOf(req.params.id);
       
      if (index === -1){
          //console.log('dodajemy do tablicy');
          voteClient.votes.push(req.params.id);
          await voteClient.save();
      } else {
        throw new Error('You already voted on this photo!');
      }
    }
    
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    if(!photoToUpdate) res.status(404).json({ message: 'Not found' });
    else {
      photoToUpdate.votes++;
      photoToUpdate.save();
      res.send({ message: 'OK' });
    }
  } catch(err) {
    res.status(500).json(err.message);
  }

};
