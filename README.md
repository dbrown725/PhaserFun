# PhaserFun

Heroku Deployment
 - Starting point
      Crate a simple phaser app locally and added/pushed to GitHub (https://github.com/)
 - Install Git bash and use for all below command line instructions
      https://gitforwindows.org/
 - Created an Heroku account
      https://heroku.com
 - Via Heroku site added an app "phaserfun"
      https://phaserfun.herokuapp.com/
 - Installed Heroku CLI on local laptop
      https://devcenter.heroku.com/articles/heroku-cli#download-and-install
 - Followed directions to convert configure app to run as php
      https://gist.github.com/wh1tney/2ad13aa5fbdd83f6a489
 - In the root of my local application run the below command which
      sets my previously created Heroku app as a remote:
      heroku git:remote -a phaserfun
 - Run the below command to let Heroku know this is a php app:
      heroku buildpacks:set heroku/php
 - Push the app to Heroku:
      git push heroku master
 - Test app deployed to Heroku:
      https://phaserfun.herokuapp.com/
