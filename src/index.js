import React, { useState } from 'react';
import { Grid } from 'react-virtualized';
import renderSVG from './components/icon-picker/controls/renderIcon';
import defaultSvgIcon from "./components/defaultSvgIcon";
import './editor.css';
import svgIcon from "./components/svgIcon";

export default function FBIconPicker(props) {
	const { value, setIconHandler } = props;
	const [showIconPicker, setIconPickerModal] = useState(false);
	const closeModal = () => setIconPickerModal( false );
	const [ insertIcon, setInsertIcon ] = useState( value );
	const [defaultIcons, setDefaultIcons] = useState(defaultSvgIcon);
	const [filteredDefaultIcons, setFilteredDefaultIcons] = useState(defaultSvgIcon);
	const [selectedCat, setSelectedCat] = useState('all-icons');

	const iconPickerModal = () => {
		setIconPickerModal(true);
	}

	// Insert icon
	const fbInsertIcon = () => {
		setIconHandler(insertIcon);
		setIconPickerModal(false);
	}

	const categories = [
		{
			slug: 'all-icons',
			title: 'All Icons'
		},
		{
			slug: 'brands',
			title: 'Brands'
		},
		{
			slug: 'business',
			title: 'Business'
		},
		{
			slug: 'communication',
			title: 'Communication'
		},
		{
			slug: 'design',
			title: 'Design'
		},
		{
			slug: 'education',
			title: 'Education'
		},
		{
			slug: 'environment',
			title: 'Environment'
		},
		{
			slug: 'lifestyle-and-hobbies',
			title: 'Lifestyle'
		},
		{
			slug: 'science-and-technology',
			title: 'Science'
		},
		{
			slug: 'social',
			title: 'Social'
		},
		{
			slug: 'travel',
			title: 'Travel'
		},
		{
			slug: 'others',
			title: 'Others'
		}
	];

	// Filter icon list
	const filterIconList = (cat) => {
		let filteredIcons = [];
		let currentGroup = [];
		setSelectedCat(cat.slug);

		if ( 'all-icons' === cat.slug ) {
			setFilteredDefaultIcons(defaultIcons);
		} else if ( 'others' === cat.slug ) {
			for ( const defaultIcon in svgIcon ) {
				if ( 0 === svgIcon[ defaultIcon ].custom_categories.length ) {
					// Add matching icon to the current group
					currentGroup.push(defaultIcon);

					// If the current group is full (like 8 icons), push it to filteredIcons
					if (currentGroup.length === 8) {
						filteredIcons.push(currentGroup);
						currentGroup = []; // Start a new group
					}
				}
			}

			if (currentGroup.length > 0) {
				filteredIcons.push(currentGroup);
			}

			setFilteredDefaultIcons(filteredIcons)
		} else {
			for ( const defaultIcon in svgIcon ) {
				// Loop through each icon group in svgIcon
				if (svgIcon[defaultIcon].custom_categories.includes(cat.slug)) {
					// Add matching icon to the current group
					currentGroup.push(defaultIcon);
				}

				// If the current group is full (like 8 icons), push it to filteredIcons
				if (currentGroup.length === 8) {
					filteredIcons.push(currentGroup);
					currentGroup = []; // Start a new group
				}
			}

			if (currentGroup.length > 0) {
				filteredIcons.push(currentGroup);
			}

			setFilteredDefaultIcons(filteredIcons)
		}
	}

	// Filter using search
	const searchFilter = (searchKey) => {
		setSelectedCat('all-icons');
		if(searchKey.target.value !== '') {
			const data = filteredDefaultIcons;

			const searchKeyword = searchKey.target.value;  // Replace with your search keyword

			const filteredData = data.map(subArray =>
				subArray.filter(item =>
					item.toLowerCase().split(/[-\s]/).some(word => word.includes(searchKeyword.toLowerCase()))
				)
			).filter(subArray => subArray.length > 0);

			setFilteredDefaultIcons(filteredData);
		} else {
			setFilteredDefaultIcons(defaultIcons);
		}
	}

	// Render icon list.
	const renderIconList = () => {
		if ( ! filteredDefaultIcons.length ) {
			return (
				<div className="fb-ip-icons icon-not-found">
					<div className="fb-icon-not-available">
						<span>No Icons Found</span>
					</div>
				</div>
			);
		}

		const iconTitle = ( actualTitle ) => {
			if ( ! actualTitle ) {
				return '';
			}
			return actualTitle.length < 11 ? actualTitle : actualTitle.slice( 0, 10 ) + '..';
		};

		const fbIconClasses = ( classes ) => ( classes.filter( Boolean ).join( ' ' ) );

		function cellRenderer( renderer ) {
			const { columnIndex, key, rowIndex, style } = renderer;

			const currentIcon = filteredDefaultIcons[ rowIndex ][ columnIndex ];

			if ( ! currentIcon ) {
				return null;
			}

			const iconClass = fbIconClasses( [
				value === currentIcon && 'default',
				currentIcon === insertIcon && 'selected',
			] );

			const actualTitle = svgIcon[currentIcon] ?.label
				? svgIcon[currentIcon].label
				: '';

			return (
				<div key={ key } style={ style } className={'fb_icon_box'}>
					<div
						className={`fb_icon ${iconClass}`}
						onClick={ () => {
							if ( value !== currentIcon ) {
								setInsertIcon( currentIcon );
							}
						} }
					>
						{ renderSVG( currentIcon ) }
						<span>{ iconTitle( actualTitle ) }</span>
					</div>
				</div>
			);
		}
		const heightAndWidth = 400 / 8;
		return (
			<div className="fb_icon_picker_icons_list">
				<Grid
					cellRenderer={ cellRenderer }
					columnCount={ filteredDefaultIcons.length }
					columnWidth={ 8 === filteredDefaultIcons.length ? heightAndWidth - 2 : 100 }
					height={ 400 }
					rowCount={ filteredDefaultIcons.length }
					rowHeight={ 8 === filteredDefaultIcons.length ? heightAndWidth : 100 }
					width={ 400 }
					autoContainerWidth={ true }
				/>
			</div>
		);
	}

	return (
		<>
			<div className='fb_icon_picker_wrapper' onClick={() => iconPickerModal()}>
				<div className={'fb_icon_picker'}>
					<div className={'Change icon'}>Change icon</div>
					{insertIcon !== '' &&
						<div onClick={() => setInsertIcon('')} className={'remove'}>
							<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 320 512">
								<path
									d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
							</svg>
						</div>
					}

					<div className={'icon_placeholder'}>
						{insertIcon !== '' ? (
							renderSVG(insertIcon)
						) : (
							<>
								<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 448 512">
									<path
										d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"></path>
								</svg>
							</>
						)}
					</div>
				</div>
			</div>
			<div>
				{showIconPicker && (
					<>
						<div onClick={closeModal} className={`fb_icon_picker_overlay ${showIconPicker && 'active'}`} />
						<div className={'fb_icon_picker_wrapper_modal'}>
							<div className={'fb_icon_picker_modal_wrapper'}>
								<div className={'fb_icon_picker_wrapper_inner'}>
									<div className={'fb_icon_picker_wrapper_header'}>
										<h2>Icon Library</h2>
										<div className={'fb_icon_picker_wrapper_search'}>
											<span>
												<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 448 512"><path
													d="M448 449L301.2 300.2c20-27.9 31.9-62.2 31.9-99.2 0-93.1-74.7-168.9-166.5-168.9C74.7 32 0 107.8 0 200.9s74.7 168.9 166.5 168.9c39.8 0 76.3-14.2 105-37.9l146 148.1 30.5-31zM166.5 330.8c-70.6 0-128.1-58.3-128.1-129.9S95.9 71 166.5 71s128.1 58.3 128.1 129.9-57.4 129.9-128.1 129.9z"></path></svg>
											</span>
											<input onChange={(e) => searchFilter(e)} type={'text'} placeholder="Search"/>
										</div>
									</div>
									<div className={'fb_icon_picker_wrapper_body'}>
										<div className={'fb_icon_picker_wrapper_categories'}>
											{categories.map((category, index) => (
												<div onClick={() => filterIconList(category)}
													className={`fb_icon_picker_wrapper_category ${selectedCat === category.slug ? 'selected' : ''}`}
													key={index}>{category.title}</div>
											))}
										</div>
										<div className={'fb_icon_picker_wrapper_icons_list'}>
											{renderIconList()}
										</div>
									</div>
									<div className={'fb_icon_picker_wrapper_footer'}>
										<button onClick={fbInsertIcon} type="button">Insert icon</button>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
