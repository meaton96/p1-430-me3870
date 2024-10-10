import React, { useState } from 'react';

const DocsRenderer = ({ docs }) => {
	const [collapsedSections, setCollapsedSections] = useState({});

	const toggleSection = (sectionName) => {
		setCollapsedSections((prevState) => ({
			...prevState,
			[sectionName]: !prevState[sectionName],
		}));
	};

	return (
		<>
			{Object.keys(docs).map((sectionName) => (
				<Section
					key={sectionName}
					sectionName={sectionName}
					sectionData={docs[sectionName]}
					isCollapsed={collapsedSections[sectionName]}
					toggleSection={toggleSection}
				/>
			))}
		</>
	);
};

const Section = ({ sectionName, sectionData, isCollapsed, toggleSection }) => (
	<section className="section">
		<h2
			onClick={() => toggleSection(sectionName)}
			style={{ cursor: 'pointer' }}
			className="title is-4"
		>
			{sectionName} {isCollapsed ? '▲' : '▼'}
		</h2>
		{!isCollapsed &&
			Object.keys(sectionData.endpoints).map((method) => (
				<MethodSection
					key={method}
					method={method}
					endpoints={sectionData.endpoints[method]}
				/>
			))}
	</section>
);

const MethodSection = ({ method, endpoints }) => (
	<div className="mb-4">
		<h3 className="title is-5">{method}</h3>
		<div className="pl-4">
			{endpoints.map((endpoint) => (
				<EndpointDetails key={endpoint.url} endpoint={endpoint} />
			))}
		</div>
	</div>
);

const openEndpointLink = (endPointObject) => {
	if (!endPointObject.examples || endPointObject.examples.length === 0) {
		window.open(endPointObject.url, '_blank');
	} else {
		window.open(endPointObject.examples[0], '_blank');
	}
}

const EndpointDetails = ({ endpoint }) => (


	<div className="box has-background-black-ter">
		<h4 id={endpoint.url} className="subtitle is-6">
			{endpoint.name}
		</h4>
		<p className="pl-4 pt-1 pb-2 is-size-5">{endpoint.description}</p>

		{endpoint.examples && endpoint.examples.length > 0 && (
			<ExamplesList examples={endpoint.examples} />
		)}

		{endpoint.statusCodes && endpoint.statusCodes.length > 0 && (
			<StatusCodesList statusCodes={endpoint.statusCodes} />
		)}

		{
			<div className='has-text-centered m-auto'>
				<button className='button' onClick={() => openEndpointLink(endpoint)}>Try Me!</button>
			</div>
		}
	</div>
);

const ExamplesList = ({ examples }) => (
	<>
		{examples.map((example) => (
			<p className="pl-4" key={example}>
				Ex.
				<span className="pl-1">
					<code>{example}</code>
				</span>
			</p>
		))}
	</>
);

const StatusCodesList = ({ statusCodes }) => (
	<div className="pt-2">
		<p className="pl-4">Status Codes:</p>
		{statusCodes.map((status) => (
			<p className="pl-4 is-size-6" key={status.code}>
				<span className="pl-1">
					{`${status.code} - ${status.description}`}
				</span>
			</p>
		))}
	</div>
);

export default DocsRenderer;
