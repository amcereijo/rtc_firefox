// functionality of the plugin
var ExternFunction = (function() {

	var l10n, 
		liTitle,
		liText,
		titleText,
		retweetText,
		//rtc li element
	    rtcLiElement = '<li class="action-reply-container rtc"><a class="with-icn" data-modal="tweet-reply" href="#" title="'+liTitle+'"><i class="sm-rt"></i><b>'+liText+'</b></a></li>',
		//to save the new tweet original title
		previusTitle = '',
		tweetButton,
		tweetDialog,
		tweetDialogContent,
		elementToObserv,


	//action when rtc li element is clicked
	clickRtc = function (e) {
		//avoid to execute "a" default action
		e.preventDefault();
		var target = e.target,
			//tweet element
        	parent = $(target).closest('.content'),
        	//tweet text
			tweetText = $(parent).find('.js-tweet-text').text(),
			//twitter user
			twitterUser = retweetText + $(parent).find('span.username').find('b').text()+ ' ',
			
		//click to open new tweet modal
		$(tweetButton).click();
		//save previus title
		previusTitle = $(tweetDialogTitle).text();
		//change modal title,add class to title elemento to find it later and remove orginal title class and center new title
		$(tweetDialogTitle).text(titleText)
			.addClass('rtcTitle')
			.removeClass('modal-title')
			.css('text-align','center');
		//add retweet text
		$(tweetDialogContent).text(twitterUser+tweetText);
	},

	//function to set original title, class and empty content
	clickNewTweet = function () {
		if(previusTitle !== ''){
		//remove center title, add original title class, remove temporal "rtc" title class and set original title
		$(tweetDialogTitle).css('text-align','')
			.addClass('modal-title')
			.removeClass('rtcTitle')
			.text(previusTitle);
			//remove retweet text
			$(tweetDialogContent).empty();
			previusTitle = '';
		}
	},

	//function for page tree modification
	treeModifi = function () {
		addOption();
	},

	//function to add li rtc elements and its actions
	addOption = function () {
		if($('ul.tweet-actions:not(.rtc)').length !== 0){

			//remove tree listener while we modify the page content
			$(elementToObserv).unbind("DOMSubtreeModified");
			//finde elements with no rtc li option
			$('ul.tweet-actions:not(.rtc)').prepend(rtcLiElement);
			//add class to ul for mark as option rtc added
			$('ul.tweet-actions:not(.rtc)').addClass('rtc');

			//add click Rt+C 
		    $(elementToObserv).on('click', 'li.rtc', clickRtc);
			
			//add tree listener to know when we have to add more rtc li elements
			$(elementToObserv).bind("DOMSubtreeModified",treeModifi);
		}
	},

	//set l10 vars and init plugin functions
	setUpAndStart = function(inl10n) {
		//avoid profile page
		if($('.profile.active').length === 0){
			liTitle = inl10n[0];
			liText = inl10n[1];
			titleText = inl10n[2];
			retweetText = inl10n[3];
			tweetButton = $('#global-new-tweet-button');
			tweetDialog = $('#global-tweet-dialog');
			tweetDialogContent = $('#tweet-box-global').find('div');
	        if(tweetDialogContent.length===0){
	            tweetDialogContent = $('#tweet-box-global');
	        }
	        //modal title element 
			tweetDialogTitle = $(tweetDialog).find('.modal-title');
	        elementToObserv = $('#page-outer');
			//add click function whe click open new tweet element
			$(tweetButton).click(clickNewTweet);
			addOption();
		}

	};

	//listener methods
	self.port.on("setL10MessagesPort", setUpAndStart);

	//public methods
	return {
		initPlugin : function () {
			self.port.emit('getL10nMessagesPort');
		}
	}
	
})();

//execute when load
ExternFunction.initPlugin();
