import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons'

const Loading = ( ) => {

    return (
        <div className={'App '}>
          <header className={'App-header'}>
            <FontAwesomeIcon className={'App-logo'} icon={faCircleNotch}  />
            <h3 className={'mt-5'}>
              Loading Web3. Please Wait.
            </h3>
          </header>
        </div>
    )

}

export default Loading;