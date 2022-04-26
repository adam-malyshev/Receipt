import { useState, useEffect } from 'react'
import { nftContractAddress } from '../config.js'
import { ethers } from 'ethers'
import axios from 'axios'

import NFT from '../utils/ReceiptNFT.json'

const AddressForm = (props) => {
	const [streetaddress, setStreetAddress] = useState("");
	const [city, setCity] = useState("");
	const [zip, setZip] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("");
	
	const handleSubmit = (event, ) => {
		
	}


	return (
	  <form onSubmit={handleSubmit}>
		<input type="address" id="address" value={streetaddress} onChange={(e)=>{setStreetAddress(e.target.value)}}/>
		<input type="city" id="city" value={city} onChange={(e)=>{setCity(e.target.value)}}/>
		<input type="zip" id="zip" value={zip} onChange={(e)=>{setZip(e.target.value)}}/>
		<input type="state" id="state" value={state} onChange={(e)=>{setState(e.target.value)}}/>
		<input type="country" id="country" value = {country} onChange={(e)=>{setCountry(e.target.value)}}/>
		<input type="submit" value="Submit" />
	  </form>
	);
}

const mint = () => {
  	const [receiptData, setReceiptData] = useState(null)
	const [mintedNFT, setMintedNFT] = useState(null)
	const [miningStatus, setMiningStatus] = useState(null)
	const [loadingState, setLoadingState] = useState(0)
	const [txError, setTxError] = useState(null)
	const [currentAccount, setCurrentAccount] = useState('')
	const [correctNetwork, setCorrectNetwork] = useState(false)

	
	
	const mintForm = () => {
		const [recipientName, setRecipientName] = useState(null)
		const [recipient, setRecipient] = useState(null)


		
	}
	
	
	
	// Checks if wallet is connected
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum obejct: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			console.log('Found authorized Account: ', accounts[0])
			setCurrentAccount(accounts[0])
		} else {
			console.log('No authorized account found')
		}
	}

	// Calls Metamask to connect wallet on clicking Connect Wallet button
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId'})
			console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x4'

			if (chainId !== rinkebyChainId) {
				alert('You are not connected to the Rinkeby Testnet!')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	// Checks if wallet is connected to the correct network
	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const rinkebyChainId = '0x4'

		if (chainId !== rinkebyChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
	}

	useEffect(() => {
		// hook that runs whenever React updates the DOM
		// i.e. any change is made
		checkIfWalletIsConnected()
		checkCorrectNetwork()
	}, [])

	// Creates transaction to mint NFT on clicking Mint Character button
	const mintReceipt = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)
        
				let nftTx = await nftContract.create(receiptData)
				console.log('Mining....', nftTx.hash)
				setMiningStatus(0)

				let tx = await nftTx.wait()
				setLoadingState(1)
				console.log('Mined!', tx)
				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)

				getMintedNFT(tokenId)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
			setTxError(error.message)
		}
	}

	// Gets the minted NFT data
	const getMintedNFT = async (tokenId) => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)

				let tokenUri = await nftContract.tokenURI(tokenId)
				let data = await axios.get(tokenUri)
				let meta = data.data

				setMiningStatus(1)
				setMintedNFT(meta.image)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
			setTxError(error.message)
		}
	}

	return (
		<div className='flex flex-col items-center pt-32 bg-[#f3f6f4] text-[#6a50aa] min-h-screen'>

			<div className='trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out'>

			</div>

			<h2 className='text-3xl font-bold mb-20 mt-12'>
				Mint your Receipt!
			</h2>

		{
			currentAccount === '' ? (
			// if current account empty
			<button
				className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
				onClick={connectWallet}
			>
				Connect Wallet
			</button>
			) : correctNetwork ? (

			// if account connected and correct network
			<button
				className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
				onClick={mintReceipt}
			>
				Mint Receipt
			</button>

			) : (
			// if accounted connected but not correct network
			<div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
			<div>----------------------------------------</div>
			<div>Please connect to the Rinkeby Testnet</div>
			<div>and reload the page</div>
			<div>----------------------------------------</div>
			</div>
			)
      	}


		{
			loadingState === 0 ? (
			// if not loaded
			miningStatus === 0 ? (
				// if not minted

				txError === null ? (
					// if not failed transaction
					<div className='flex flex-col justify-center items-center'>
						<div className='text-lg font-bold'>
						Processing your transaction
						</div>

					</div>
				) : (
					// not loaded, minted, and tx error
					<div className='text-lg text-red-600 font-semibold'>{txError}</div>
				)
				
			) : (
				// if minted
				<div></div>
			)
			) : (
			// if loaded

				<div className='flex flex-col justify-center items-center'>
					<div className='font-semibold text-lg text-center mb-4'>
						Your Eternal Domain Character
					</div>

					<img
						src={mintedNFT}
						alt=''
						className='h-60 w-60 rounded-lg shadow-2xl shadow-[#6FFFE9] hover:scale-105 transition duration-500 ease-in-out'
					/>
				</div>
			)

      	}
		</div>
	)
}

export default mint