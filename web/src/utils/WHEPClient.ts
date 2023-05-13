import SDPExchange from './SDP.js'

/**
 * Example implementation of a client that uses WHEP to playback video over WebRTC
 *
 * https://www.ietf.org/id/draft-murillo-whep-00.html
 */
export default class WHEPClient {
  public peerConn: RTCPeerConnection
  public stream: MediaStream

  constructor(private endpoint: string, private videoElement: HTMLVideoElement) {
    this.stream = new MediaStream()

    /**
     * Create a new WebRTC connection, using public STUN servers with ICE,
     * allowing the client to disover its own IP address.
     * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols#ice
     */
    this.peerConn = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.cloudflare.com:3478'
        }
      ],
      bundlePolicy: 'max-bundle'
    })

    /** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTransceiver */
    this.peerConn.addTransceiver('video', {
      direction: 'recvonly'
    })
    this.peerConn.addTransceiver('audio', {
      direction: 'recvonly'
    })

    /**
     * When new tracks are received in the connection, store local references,
     * so that they can be added to a MediaStream, and to the <video> element.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
     */
    this.peerConn.ontrack = (event) => {
      const track = event.track
      const currentTracks = this.stream.getTracks()
      const vTrackReady = currentTracks.some((track) => track.kind === 'video')
      const aTrackReady = currentTracks.some((track) => track.kind === 'audio')
      switch (track.kind) {
        case 'video':
          if (vTrackReady) {
            break
          }
          this.stream.addTrack(track)
          break
        case 'audio':
          if (aTrackReady) {
            break
          }
          this.stream.addTrack(track)
          break
        default:
          console.log('got unknown track ' + track)
      }
    }

    this.peerConn.addEventListener('connectionstatechange', (ev) => {
      if (this.peerConn.connectionState !== 'connected') {
        return
      }
      if (!this.videoElement) {
        return
      }
      this.videoElement.srcObject = this.stream
    })

    this.peerConn.addEventListener('negotiationneeded', (ev) => {
      SDPExchange(this.peerConn, this.endpoint)
    })
  }

  close() {
    console.log('whep peerConn closing')
    this.peerConn.close()
  }

  connActive() {
    return this.peerConn.connectionState !== 'closed'
  }
}
