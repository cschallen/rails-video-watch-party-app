import { screenshareMode, setButtonDisplay, streamLayout } from './app_helpers.js';

export default class Party {
  constructor(session) {
    this.session = session;
    this.watchLink = document.getElementById("watch-mode");
    this.subscribers = document.getElementById("subscribers");
    this.participantCount = document.getElementById("participant-count");
    this.clickStatus = 'off';
    this.setupEventHandlers();
    this.connectionCount = 0;
    setButtonDisplay(this.watchLink);
  }

  setupEventHandlers() {
    let self = this;
    this.session.on({
      // This function runs when another client publishes a stream (eg. session.publish())
      streamCreated: function(event) {
        // Subscribe to the stream that caused this event, and place it into the element with id="subscribers"
        self.session.subscribe(event.stream, 'subscribers', {
          insertMode: 'append',
          width: "100%",
          height: "100%",
          subscribeToAudio: false,
        }, function(error) {
          if (error) {
            console.error('Failed to subscribe', error);
          }
        });
      },

      // This function runs whenever a client connects to a session
      connectionCreated: function(event) {
        self.connectionCount++;
        self.participantCount.textContent = `${self.connectionCount} Participante`;
        streamLayout(self.subscribers, self.connectionCount);
      },

      // This function runs whenever a client disconnects from the session
      connectionDestroyed: function(event) {
        self.connectionCount--;
        self.participantCount.textContent = `${self.connectionCount} Participantes`;
        streamLayout(self.subscribers, self.connectionCount);
      }
    });

    this.watchLink.addEventListener('click', function(event) {
      event.preventDefault();
      if (self.clickStatus == 'off') {
        // Go to screenshare view
        screenshareMode(self.session, 'on');
      };
    });
  }
}