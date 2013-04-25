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
		previusTitle;


	//action when rtc li element is clicked
	var clickRtc = function (e) {
		//avoid to execute "a" default action
		e.preventDefault();
		var target = e.target;
		//tweet element
        var parent = $(target).closest('.content');
        //tweet text
		var tweetText = $(parent).find('.js-tweet-text').text();
		//twitter user
		var twitterUser = retweetText + $(parent).find('span.username').find('b').text()+ ' ';
		//click to open new tweet modal
		$('#global-new-tweet-button').click();
		//save previus title
		previusTitle = $('#global-tweet-dialog').find('.modal-title').text();
		//change modal title
		$('#global-tweet-dialog').find('.modal-title').text(titleText);
		//add class to title elemento to find it later
		$('#global-tweet-dialog').find('.modal-title').addClass('rtcTitle');
		//remove orginal title class
		$('#global-tweet-dialog').find('.rtcTitle').removeClass('modal-title');
		//center new title
		$('.rtcTitle').css('text-align','center');
		
		//add retweet text
        var divContent = $('#tweet-box-global').find('div');
        if(divContent.length===0){
            divContent = $('#tweet-box-global');
        }
		$(divContent).text(twitterUser+tweetText);
	};

	//function to set original title, class and empty content
	var clickNewTweet = function () {
		if(previusTitle !== ''){
			//remove center title
			$('.rtcTitle').css('text-align','');
			//add original title class
			$('#global-tweet-dialog').find('.rtcTitle').addClass('modal-title');
			//remove temporal "rtc" title class
			$('#global-tweet-dialog').find('.modal-title').removeClass('rtcTitle');
			//set original title
			$('#global-tweet-dialog').find('.modal-title').text(previusTitle);
			//remove retweet text
			var divContent = $('#tweet-box-global').find('div');
	        if(divContent.length===0){
	            divContent = $('#tweet-box-global');
	        }
	    	//$(divContent).text('');
			$(divContent).empty();
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
		//remove tree listener while we modify the page content
		$('#page-outer').unbind("DOMSubtreeModified");
		//finde elements with no rtc li option
		$('ul.tweet-actions:not(.rtc)').prepend(rtcLiElement);
		//add click Rt+C 
        $('#page-outer').on('click', 'li.rtc', clickRtc);
		//add class to ul for mark as option rtc added
		$('ul.tweet-actions:not(.rtc)').addClass('rtc');
		//add tree listener to know when we have to add more rtc li elements
		$('#page-outer').bind("DOMSubtreeModified",treeModifi);
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
			//add click function whe click open new tweet element
		$('#global-new-tweet-button').click(clickNewTweet);
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
