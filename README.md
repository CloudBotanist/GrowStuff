# Growstuff - *Dashboard*
Growstuff is a Cloud-botanist solution for a self-sufficient plant. Created by students from INSA Lyon.

For more information, check out [http://cloudbotanist.github.io/](http://cloudbotanist.github.io/)


## Installation

* Download the latest release.
* Clone the repo: `git clone git@github.com:pmdartus/GrowStuff.git`
* Install node and bower if it not already installed
* Install all dependencies : `npm install`
* Go to [Twitter developer center](https://dev.twitter.com/) to create the app and get your API credentials
* Add environment keys on Terminal

		export TWITTER_CONSUMER_KEY=...
		export TWITTER_CONSUMER_SECRET=...
		export TWITTER_ACCESS_TOKEN=...
		export TWITTER_ACCESS_TOKEN_SECRET=...
		export PORT=3000 # server port

* Launch the server using: `grunt serve`


## Getting started
1. Once you have launched your server go to the root and connect your twitter account.


2. Add a plant with its differnt options:
	* Nickname: plant name that you'll use to mention her on twitter
	* Type: Plant botanic category
	* Mode: If **manual** is selected, you need to water the plant remotly using the dashboard or twitter. Otherwise, in the auto mode, the plant will water herself depending on the the data provided bellow:
	* Consumption: Volume for one watering shot (in mililitter)
	* Frequency: How often the plant will be wattered in one week
![Screen add plant](https://dl.dropboxusercontent.com/sh/38fl5z88rbdixap/HA2sY_EbIX/growstuff_add_plant.png?token_hash=AAFUUk539kL52a9dGzDDgjQIYWi1nbZjymV2XaIEj4LlrQ =780x)

3. Once validated, you'll need to follow the instruction to connect your dashboard with the plant:
![Screen installation](https://dl.dropboxusercontent.com/sh/38fl5z88rbdixap/_IhZY1SK5a/growstuff_installation.png?token_hash=AAFUUk539kL52a9dGzDDgjQIYWi1nbZjymV2XaIEj4LlrQ =780x)	
	* You'll need to downlaod the connector software and drag and drop the configuration file. Insert then you Wifi credentials, and you're all set!
	

4. The plant is activated in the dashboard an waiting then for a signal from the plant:
![Screen dashboard](https://dl.dropboxusercontent.com/sh/38fl5z88rbdixap/4i05LCT71u/growstuff_dashboard.png?token_hash=AAFUUk539kL52a9dGzDDgjQIYWi1nbZjymV2XaIEj4LlrQ =780x)


5. To water manually the plant, you can click on the dropdown "Water it" and select the volume that you'd like to send to the plant.
Or you can directly tweet the plant using the following syntax:
`@YourTwitterHandle watering 20ml for #PlantNickname`

6. If you want to get the status of the plant, tweet : `@YourTwitterHandle #PlantNickname give me your status`

7. Enjoy!



## Do it yourself...
You want one? You just need to have fun and *DO IT YOURSELF*! Every line of code is open source and we have made some crazy simple tutorials for you to create you Plant 2.0 and impress your friends ;)

### ...and contibute to the project
1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request


## Bugs and feature requests
Have a bug or a feature request? Please search for existing and closed issues. If your problem or idea is not addressed yet, please [open a new issue](https://github.com/pmdartus/GrowStuff/issues/new).

