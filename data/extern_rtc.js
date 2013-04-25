// functionality of the plugin
var ExternFunction = (function() {

	var l10n, 
		liTitle,
		liText,
		titleText,
		retweetText,
		//rtc li element
	    rtcLiElement,
		//to save the new tweet original title
		previusTitle,
		tweetButton,
		tweetDialog,
		tweetDialogContent,
		elementToObserv;


	//action when rtc li element is clicked
	var clickRtc = function (e) {
		//avoid to execute "a" default action
		e.preventDefault();
		var target = e.target,
			//tweet element
        	parent = $(target).closest('.content'),
        	//tweet text
			tweetText = $(parent).find('.js-tweet-text').text(),
			//twitter user
			twitterUser = retweetText + $(parent).find('span.username').find('b').text()+ ' ',
			//modal title element 
			tweetDialogTitle = $(tweetDialog).find('.modal-title');
		//click to open new tweet modal
		$(tweetButton).click();
		//save previus title
		previusTitle = $(tweetDialog).find('.modal-title').text();
		//change modal title
		$(tweetDialogTitle).text(titleText);
		//add class to title elemento to find it later
		$(tweetDialogTitle).addClass('rtcTitle');
		//remove orginal title class
		$(tweetDialog).find('.rtcTitle').removeClass('modal-title');
		//center new title
		$('.rtcTitle').css('text-align','center');
		//add retweet text
		$(tweetDialogContent).text(twitterUser+tweetText);
	};

	//function to set original title, class and empty content
	var clickNewTweet = function () {
		if(previusTitle !== ''){
			//remove center title
			$('.rtcTitle').css('text-align','');
			//add original title class
			$(tweetDialog).find('.rtcTitle').addClass('modal-title');
			//modal title element 
			var tweetDialogTitle = $(tweetDialog).find('.modal-title')
			//remove temporal "rtc" title class
			$(tweetDialogTitle).removeClass('rtcTitle');
			//set original title
			$(tweetDialogTitle).text(previusTitle);

			//remove retweet text
			$(tweetDialogContent).empty();
		}
	};

	//function for page tree modification
	var treeModifi = function () {
		if($('ul.tweet-actions:not(.rtc)').length !== 0){
			addOption();
		}
	};

	//function to add li rtc elements and its actions
	var addOption = function () {
		if($('ul.tweet-actions:not(.rtc)') !== 0){

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
	};

	//set l10 vars and init plugin functions
	var setUpAndStart = function(inl10n) {
		//avoid profile page
		if($('.profile.active').length===0){
			liTitle = inl10n[0];
			liText = inl10n[1];
			titleText = inl10n[2];
			retweetText = inl10n[3];
			rtcLiElement = '<li class="action-reply-container rtc"><a class="with-icn" data-modal="tweet-reply" href="#" title="'+liTitle+'"><i class="sm-rt"></i><b>'+liText+'</b></a></li>';
			tweetButton = $('#global-new-tweet-button');
			tweetDialog = $('#global-tweet-dialog');
			tweetDialogContent = $('#tweet-box-global').find('div');
	        if(tweetDialogContent.length===0){
	            tweetDialogContent = $('#tweet-box-global');
	        }
	        elementToObserv = $('#page-outer');
			//add click function whe click open new tweet element
			$(tweetButton).click(clickNewTweet);
			addOption();
		};

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
